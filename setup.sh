#!/usr/bin/env bash
set -euo pipefail

if command -v python3 >/dev/null 2>&1; then
  PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_CMD="python"
else
  echo "[ERROR] Python not found in PATH. Install Python 3.9+ and try again."
  exit 1
fi

"${PYTHON_CMD}" setup_project.py "$@"
