# Start NLSQL Frontend (Next.js)
Write-Host "Clearing Next.js cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force "$PSScriptRoot\frontend\.next" -ErrorAction SilentlyContinue

Write-Host "Starting Next.js frontend on port 3000..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\frontend"
npm run dev
