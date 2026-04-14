#!/usr/bin/env python3
"""
Initialize QuickCart PostgreSQL database from database/schema.sql.

This script:
1. Loads environment from .env and backend/.env (backend overrides root).
2. Creates the target database if it does not exist.
3. Applies schema.sql to create/reset tables and seed base data.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from urllib.parse import urlparse

import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_ENV_PATH = ROOT_DIR / "backend" / ".env"
ROOT_ENV_PATH = ROOT_DIR / ".env"
SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def load_environment() -> None:
    """Load root and backend env files when available."""
    if ROOT_ENV_PATH.exists():
        load_dotenv(ROOT_ENV_PATH)
    if BACKEND_ENV_PATH.exists():
        load_dotenv(BACKEND_ENV_PATH, override=True)


def value_is_placeholder(value: str | None) -> bool:
    if value is None:
        return True

    normalized = value.strip().lower()
    if not normalized:
        return True

    placeholder_tokens = (
        "your_",
        "change_me",
        "<",
        "example",
    )
    return any(token in normalized for token in placeholder_tokens)


def read_db_config() -> dict[str, str]:
    """Read DB config from DATABASE_URL or DB_* env variables."""
    database_url = os.getenv("DATABASE_URL", "").strip()

    if database_url and not value_is_placeholder(database_url):
        parsed = urlparse(database_url)
        if parsed.scheme not in {"postgres", "postgresql"}:
            raise ValueError(
                "DATABASE_URL must start with postgres:// or postgresql://"
            )

        db_name = parsed.path.lstrip("/")
        config = {
            "host": parsed.hostname or "",
            "port": str(parsed.port or 5432),
            "name": db_name,
            "user": parsed.username or "",
            "password": parsed.password or "",
        }
    else:
        config = {
            "host": os.getenv("DB_HOST", "").strip(),
            "port": os.getenv("DB_PORT", "5432").strip(),
            "name": os.getenv("DB_NAME", "").strip(),
            "user": os.getenv("DB_USER", "").strip(),
            "password": os.getenv("DB_PASSWORD", "").strip(),
        }

    missing = [
        key
        for key, value in config.items()
        if value_is_placeholder(value)
    ]
    if missing:
        raise ValueError(
            "Missing DB configuration. Fill these values in backend/.env: "
            + ", ".join([f"DB_{key.upper()}" if key != "name" else "DB_NAME" for key in missing])
        )

    return config


def create_database_if_missing(config: dict[str, str]) -> None:
    """Create target database using postgres admin database if missing."""
    admin_db = os.getenv("DB_ADMIN_DB", "postgres")

    print(f"Connecting to admin DB '{admin_db}' to verify database '{config['name']}'...")
    with psycopg2.connect(
        host=config["host"],
        port=config["port"],
        user=config["user"],
        password=config["password"],
        dbname=admin_db,
    ) as conn:
        conn.autocommit = True
        with conn.cursor() as cursor:
            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (config["name"],))
            exists = cursor.fetchone() is not None

            if exists:
                print(f"Database '{config['name']}' already exists.")
                return

            cursor.execute(
                sql.SQL("CREATE DATABASE {}")
                .format(sql.Identifier(config["name"]))
            )
            print(f"Created database '{config['name']}'.")


def apply_schema(config: dict[str, str]) -> None:
    """Apply schema.sql to the target database."""
    if not SCHEMA_PATH.exists():
        raise FileNotFoundError(f"Schema file not found: {SCHEMA_PATH}")

    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")

    print(f"Applying schema from {SCHEMA_PATH}...")
    with psycopg2.connect(
        host=config["host"],
        port=config["port"],
        user=config["user"],
        password=config["password"],
        dbname=config["name"],
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute(schema_sql)
        conn.commit()

    print("Schema applied successfully.")


def main() -> int:
    print("QuickCart DB initialization started.")
    print("Note: schema.sql contains DROP TABLE IF EXISTS and will reset existing tables.")

    try:
        load_environment()
        config = read_db_config()
        create_database_if_missing(config)
        apply_schema(config)
    except Exception as exc:
        print(f"DB initialization failed: {exc}")
        return 1

    print("QuickCart DB initialization completed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
