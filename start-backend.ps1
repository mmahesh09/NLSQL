# Start NLSQL Backend (FastAPI)
Write-Host "Starting FastAPI backend on port 8000..." -ForegroundColor Cyan

Set-Location "$PSScriptRoot\backend"

# Activate virtual environment
& ".\.venv\Scripts\Activate.ps1"

# Start uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
