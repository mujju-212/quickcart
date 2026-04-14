#!/usr/bin/env python3
"""
Copy data from local PostgreSQL (blink_basket) to Supabase PostgreSQL.

Features:
- Batched upserts for speed and idempotence.
- Dependency-aware table order to avoid FK failures.
- Sequence synchronization after copy.
"""

from __future__ import annotations

import argparse
import os
from typing import Iterable

import psycopg2
from psycopg2 import sql
from psycopg2.extras import execute_values


DEFAULT_TABLE_ORDER = [
    "categories",
    "products",
    "users",
    "user_addresses",
    "orders",
    "order_items",
    "order_timeline",
    "cart_items",
    "wishlist_items",
    "banners",
    "offers",
    "product_reviews",
    "otp_rate_limits",
    "api_rate_limits",
]


def get_tables(conn) -> list[str]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name
            """
        )
        return [row[0] for row in cur.fetchall()]


def ordered_tables(source_tables: Iterable[str], target_tables: Iterable[str]) -> list[str]:
    source_set = set(source_tables)
    target_set = set(target_tables)
    common = source_set.intersection(target_set)

    ordered = [t for t in DEFAULT_TABLE_ORDER if t in common]
    remaining = sorted(common.difference(ordered))
    return ordered + remaining


def get_columns(conn, table: str) -> list[str]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = %s
            ORDER BY ordinal_position
            """,
            (table,),
        )
        return [row[0] for row in cur.fetchall()]


def get_primary_key_columns(conn, table: str) -> list[str]:
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT a.attname
            FROM pg_index i
            JOIN pg_class c ON c.oid = i.indrelid
            JOIN pg_namespace n ON n.oid = c.relnamespace
            JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = ANY(i.indkey)
            WHERE n.nspname = 'public'
              AND c.relname = %s
              AND i.indisprimary
            ORDER BY array_position(i.indkey, a.attnum)
            """,
            (table,),
        )
        return [row[0] for row in cur.fetchall()]


def table_count(conn, table: str) -> int:
    with conn.cursor() as cur:
        cur.execute(sql.SQL("SELECT COUNT(*) FROM {}.{}").format(sql.Identifier("public"), sql.Identifier(table)))
        return int(cur.fetchone()[0])


def build_upsert_sql(table: str, columns: list[str], pk_columns: list[str]) -> sql.SQL:
    col_identifiers = [sql.Identifier(c) for c in columns]
    base = sql.SQL("INSERT INTO {}.{} ({}) VALUES %s").format(
        sql.Identifier("public"),
        sql.Identifier(table),
        sql.SQL(", ").join(col_identifiers),
    )

    if not pk_columns:
        return base

    pk_identifiers = [sql.Identifier(c) for c in pk_columns]
    non_pk = [c for c in columns if c not in pk_columns]

    if not non_pk:
        return base + sql.SQL(" ON CONFLICT ({}) DO NOTHING").format(sql.SQL(", ").join(pk_identifiers))

    update_parts = [
        sql.SQL("{} = EXCLUDED.{}").format(sql.Identifier(c), sql.Identifier(c))
        for c in non_pk
    ]

    return (
        base
        + sql.SQL(" ON CONFLICT ({}) DO UPDATE SET ").format(sql.SQL(", ").join(pk_identifiers))
        + sql.SQL(", ").join(update_parts)
    )


def migrate_table(src_conn, dst_conn, table: str, batch_size: int) -> None:
    src_columns = get_columns(src_conn, table)
    dst_columns = get_columns(dst_conn, table)

    if not src_columns or not dst_columns:
        print(f"[SKIP] {table}: no columns")
        return

    dst_set = set(dst_columns)
    columns = [c for c in src_columns if c in dst_set]
    if not columns:
        print(f"[SKIP] {table}: no common columns between source and target")
        return

    pk_columns = get_primary_key_columns(dst_conn, table)
    src_count = table_count(src_conn, table)
    dst_before = table_count(dst_conn, table)

    if src_count == 0:
        print(f"[SKIP] {table}: source empty (target has {dst_before})")
        return

    upsert_query = build_upsert_sql(table, columns, [c for c in pk_columns if c in columns])
    select_query = sql.SQL("SELECT {} FROM {}.{}").format(
        sql.SQL(", ").join([sql.Identifier(c) for c in columns]),
        sql.Identifier("public"),
        sql.Identifier(table),
    )

    transferred = 0
    with src_conn.cursor(name=f"src_{table}") as src_cur, dst_conn.cursor() as dst_cur:
        src_cur.itersize = batch_size
        src_cur.execute(select_query)

        while True:
            rows = src_cur.fetchmany(batch_size)
            if not rows:
                break

            execute_values(dst_cur, upsert_query.as_string(dst_conn), rows, page_size=batch_size)
            transferred += len(rows)

    dst_conn.commit()
    dst_after = table_count(dst_conn, table)
    missing_in_target = [c for c in src_columns if c not in dst_set]
    suffix = f", skipped_columns={missing_in_target}" if missing_in_target else ""
    print(
        f"[OK] {table}: source={src_count}, target_before={dst_before}, "
        f"target_after={dst_after}, processed={transferred}{suffix}"
    )


def sync_sequences(dst_conn) -> None:
    with dst_conn.cursor() as cur:
        cur.execute(
            """
            SELECT
                c.relname AS table_name,
                a.attname AS column_name,
                s.relname AS sequence_name
            FROM pg_class s
            JOIN pg_depend d ON d.objid = s.oid
            JOIN pg_class c ON d.refobjid = c.oid
            JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum = d.refobjsubid
            JOIN pg_namespace ns ON ns.oid = c.relnamespace
            WHERE s.relkind = 'S'
              AND ns.nspname = 'public'
            ORDER BY c.relname
            """
        )
        seq_rows = cur.fetchall()

        for table_name, column_name, sequence_name in seq_rows:
            cur.execute(
                sql.SQL("SELECT COALESCE(MAX({}), 0) FROM {}.{}").format(
                    sql.Identifier(column_name),
                    sql.Identifier("public"),
                    sql.Identifier(table_name),
                )
            )
            max_value = int(cur.fetchone()[0])

            cur.execute(
                sql.SQL("SELECT setval({seq}, %s, %s)").format(
                    seq=sql.Literal(f"public.{sequence_name}")
                ),
                (max_value, max_value > 0),
            )

    dst_conn.commit()
    print("[OK] Sequence synchronization complete")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Migrate local PostgreSQL data into Supabase")
    parser.add_argument(
        "--source-url",
        default=os.getenv("LOCAL_DATABASE_URL"),
        help="Local PostgreSQL URL (or set LOCAL_DATABASE_URL)",
    )
    parser.add_argument(
        "--target-url",
        default=os.getenv("SUPABASE_DATABASE_URL"),
        help="Supabase PostgreSQL URL (or set SUPABASE_DATABASE_URL)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=1000,
        help="Batch size for transfer (default: 1000)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if not args.source_url or not args.target_url:
        print("Missing database URL(s). Provide --source-url and --target-url or env vars.")
        return 1

    print("Connecting to source and target databases...")
    src_conn = psycopg2.connect(args.source_url)
    dst_conn = psycopg2.connect(args.target_url)

    try:
        source_tables = get_tables(src_conn)
        target_tables = get_tables(dst_conn)
        tables = ordered_tables(source_tables, target_tables)

        print(f"Source tables: {len(source_tables)} | Target tables: {len(target_tables)} | Common: {len(tables)}")
        print("Migration order:", ", ".join(tables))

        for table in tables:
            migrate_table(src_conn, dst_conn, table, args.batch_size)

        sync_sequences(dst_conn)
        print("Data migration completed successfully.")
        return 0
    except Exception as exc:
        dst_conn.rollback()
        print(f"Migration failed: {exc}")
        return 1
    finally:
        src_conn.close()
        dst_conn.close()


if __name__ == "__main__":
    raise SystemExit(main())
