# =================================================
# FinTrackPro Full-stack Setup Script (Windows)
# =================================================

Write-Host "Starting FinTrackPro setup..." -ForegroundColor Green

# --- 1 Check if PostgreSQL is installed ---
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
$pgInstalled = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgInstalled) {
    Write-Host "PostgreSQL is not installed. Please install PostgreSQL first:" -ForegroundColor Red
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Install with default settings" -ForegroundColor Yellow
    Write-Host "3. Make sure psql is in your PATH" -ForegroundColor Yellow
    Write-Host "4. Run this script again after installation" -ForegroundColor Yellow
    exit 1
}
Write-Host "PostgreSQL is installed" -ForegroundColor Green

# --- 2 Create Database and User ---
Write-Host "Creating database and user..." -ForegroundColor Yellow
$createDbScript = @"
CREATE DATABASE fintrackdb;
CREATE USER fintrackuser WITH ENCRYPTED PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE fintrackdb TO fintrackuser;
"@
$createDbScript | psql -U postgres -h localhost -p 5432
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create database. Please check PostgreSQL credentials." -ForegroundColor Red
    exit 1
}
Write-Host "Database 'fintrackdb' and user 'fintrackuser' created" -ForegroundColor Green

# --- 3 Create backend .env file ---
Write-Host "Setting up backend environment variables..." -ForegroundColor Yellow
$backendEnv = @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fintrackdb
DB_USER=fintrackuser
DB_PASSWORD=StrongPassword123
JWT_SECRET=YourSuperSecretKey
JWT_EXPIRES_IN=1d
PORT=5000
STOCK_API_KEY=your_stock_api_key
NEWS_API_KEY=your_news_api_key
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourEmailPassword
"@
$backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "Backend .env created at backend\.env" -ForegroundColor Green

# --- 4 Install backend dependencies ---
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Backend dependencies installed" -ForegroundColor Green

# --- 5 Create frontend .env file ---
Write-Host "Setting up frontend environment variables..." -ForegroundColor Yellow
$frontendEnv = @"
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_STOCK_API_KEY=your_stock_api_key
REACT_APP_NEWS_API_KEY=your_news_api_key
"@
$frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8
Write-Host "Frontend .env created at frontend\.env" -ForegroundColor Green

# --- 6 Install frontend dependencies ---
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "Frontend dependencies installed" -ForegroundColor Green

# --- 7 Instructions to run ---
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Start PostgreSQL service (if not running)" -ForegroundColor White
Write-Host "2. Run backend: cd backend && npm start" -ForegroundColor White
Write-Host "3. Run frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "4. Open your browser at http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Important: Update API keys in .env files before running!" -ForegroundColor Yellow
Write-Host "Configure email settings for notifications" -ForegroundColor Yellow