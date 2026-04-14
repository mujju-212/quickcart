#!/usr/bin/env python3
"""
QuickCart one-command setup script for a new machine.

What it does:
1. Creates .env files from templates if missing.
2. Installs frontend dependencies (npm install).
3. Creates backend virtual environment and installs Python requirements.
4. Initializes PostgreSQL database schema (if DB env values are configured).
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
DATABASE_DIR = ROOT_DIR / "database"
VENV_DIR = BACKEND_DIR / ".venv"

FRONTEND_ENV_TEMPLATE = ROOT_DIR / ".env.example"
FRONTEND_ENV_FILE = ROOT_DIR / ".env"
BACKEND_ENV_TEMPLATE = BACKEND_DIR / ".env.example"
BACKEND_ENV_FILE = BACKEND_DIR / ".env"


def run_command(command: list[str], cwd: Path | None = None) -> None:
    """Run command and fail fast with clear output."""
    display = " ".join(command)
    where = str(cwd) if cwd else str(ROOT_DIR)
    print(f"\n> {display}")
    print(f"  cwd: {where}")

    completed = subprocess.run(command, cwd=cwd, check=False)
    if completed.returncode != 0:
        raise RuntimeError(f"Command failed with exit code {completed.returncode}: {display}")


def ensure_command_exists(command: str, install_hint: str) -> None:
    if shutil.which(command) is None:
        raise RuntimeError(f"Missing required command '{command}'. Install it first. Hint: {install_hint}")


def copy_template_if_missing(template_path: Path, target_path: Path) -> None:
    if target_path.exists():
        print(f"✓ {target_path} already exists")
        return

    if not template_path.exists():
        raise FileNotFoundError(f"Template file not found: {template_path}")

    shutil.copyfile(template_path, target_path)
    print(f"✓ Created {target_path} from {template_path}")


def parse_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


def is_placeholder(value: str | None) -> bool:
    if value is None:
        return True

    normalized = value.strip().lower()
    if not normalized:
        return True

    placeholders = ("your_", "change_me", "<", "example")
    return any(token in normalized for token in placeholders)


def backend_db_is_configured(env_values: dict[str, str]) -> bool:
    database_url = env_values.get("DATABASE_URL", "")
    if database_url and not is_placeholder(database_url) and "://" in database_url:
        return True

    required_keys = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"]
    return all(not is_placeholder(env_values.get(key)) for key in required_keys)


def get_venv_python() -> Path:
    if os.name == "nt":
        return VENV_DIR / "Scripts" / "python.exe"
    return VENV_DIR / "bin" / "python"


def install_frontend_dependencies() -> None:
    ensure_command_exists("npm", "Install Node.js (includes npm): https://nodejs.org")
    print("\nInstalling frontend dependencies...")
    run_command(["npm", "install"], cwd=ROOT_DIR)


def install_backend_dependencies() -> Path:
    print("\nSetting up backend virtual environment...")

    if not VENV_DIR.exists():
        run_command([sys.executable, "-m", "venv", str(VENV_DIR)], cwd=ROOT_DIR)
    else:
        print(f"✓ Virtual environment already exists at {VENV_DIR}")

    venv_python = get_venv_python()
    if not venv_python.exists():
        raise FileNotFoundError(f"Python executable not found in virtual env: {venv_python}")

    run_command([str(venv_python), "-m", "pip", "install", "--upgrade", "pip"], cwd=ROOT_DIR)
    run_command([str(venv_python), "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt")], cwd=ROOT_DIR)

    return venv_python


def initialize_database(venv_python: Path) -> None:
    backend_env_values = parse_env_file(BACKEND_ENV_FILE)

    if not backend_db_is_configured(backend_env_values):
        print("\nDatabase setup skipped: backend/.env still has placeholder DB values.")
        print("Edit backend/.env with your DB connection details, then rerun:")
        print("  python setup_project.py --db-only")
        return

    print("\nInitializing database schema...")
    run_command([str(venv_python), str(DATABASE_DIR / "init_db.py")], cwd=ROOT_DIR)


def print_next_steps() -> None:
    backend_python = get_venv_python()

    print("\nSetup completed.")
    print("\nImportant: verify and update env files before running the app:")
    print("1. .env")
    print("   - Set REACT_APP_API_URL (recommended local value: /api)")
    print("2. backend/.env")
    print("   - Set DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD or DATABASE_URL")
    print("   - Set JWT_SECRET_KEY")

    print("\nRun the app:")
    print(f"- Backend: cd backend && {backend_python} app.py")
    print("- Frontend: npm start")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="QuickCart setup script")
    parser.add_argument("--db-only", action="store_true", help="Only setup backend deps and database")
    parser.add_argument("--skip-frontend", action="store_true", help="Skip npm install")
    parser.add_argument("--skip-backend", action="store_true", help="Skip backend virtualenv and pip install")
    parser.add_argument("--skip-db", action="store_true", help="Skip database initialization")
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    try:
        ensure_command_exists("python", "Install Python 3.9+ from https://www.python.org/downloads/")
        copy_template_if_missing(FRONTEND_ENV_TEMPLATE, FRONTEND_ENV_FILE)
        copy_template_if_missing(BACKEND_ENV_TEMPLATE, BACKEND_ENV_FILE)

        if not args.db_only and not args.skip_frontend:
            install_frontend_dependencies()

        venv_python: Path | None = None
        backend_needed = args.db_only or (not args.skip_backend) or (not args.skip_db)
        if backend_needed:
            venv_python = install_backend_dependencies()

        if not args.skip_db:
            if venv_python is None:
                venv_python = get_venv_python()
            initialize_database(venv_python)

        print_next_steps()
        return 0

    except Exception as exc:
        print(f"\nSetup failed: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
