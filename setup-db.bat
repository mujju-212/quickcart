@echo off
setlocal

where python >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python not found in PATH. Install Python 3.9+ and try again.
  exit /b 1
)

python setup_project.py --db-only %*
exit /b %errorlevel%
