@echo off
REM =================================================
REM FinTrackPro Full-stack Setup Script (Windows Batch)
REM =================================================

echo Starting FinTrackPro setup...

REM --- 1 Check if PostgreSQL is installed ---
echo Checking PostgreSQL installation...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo PostgreSQL is not installed. Please install PostgreSQL first:
    echo 1. Download from: https://www.postgresql.org/download/windows/
    echo 2. Install with default settings
    echo 3. Make sure psql is in your PATH
    echo 4. Run this script again after installation
    pause
    exit /b 1
)
echo PostgreSQL is installed

REM --- 2 Create Database and User ---
echo Creating database and user...
(
echo CREATE DATABASE fintrackdb;
echo CREATE USER fintrackuser WITH ENCRYPTED PASSWORD 'StrongPassword123';
echo GRANT ALL PRIVILEGES ON DATABASE fintrackdb TO fintrackuser;
) | psql -U postgres -h localhost -p 5432
if %errorlevel% neq 0 (
    echo Failed to create database. Please check PostgreSQL credentials.
    pause
    exit /b 1
)
echo Database 'fintrackdb' and user 'fintrackuser' created

REM --- 3 Create backend .env file ---
echo Setting up backend environment variables...
mkdir backend 2>nul
(
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=fintrackdb
echo DB_USER=fintrackuser
echo DB_PASSWORD=StrongPassword123
echo JWT_SECRET=YourSuperSecretKey
echo JWT_EXPIRES_IN=1d
echo PORT=5000
echo STOCK_API_KEY=your_stock_api_key
echo NEWS_API_KEY=your_news_api_key
echo EMAIL_USER=youremail@example.com
echo EMAIL_PASS=yourEmailPassword
) > backend\.env
echo Backend .env created at backend\.env

REM --- 4 Install backend dependencies ---
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed

REM --- 5 Create frontend .env file ---
echo Setting up frontend environment variables...
mkdir frontend 2>nul
(
echo REACT_APP_BACKEND_URL=http://localhost:5000
echo REACT_APP_STOCK_API_KEY=your_stock_api_key
echo REACT_APP_NEWS_API_KEY=your_news_api_key
) > frontend\.env
echo Frontend .env created at frontend\.env

REM --- 6 Install frontend dependencies ---
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo Frontend dependencies installed

REM --- 7 Instructions to run ---
echo Setup complete!
echo.
echo To start the application:
echo 1. Start PostgreSQL service ^(if not running^)
echo 2. Run backend: cd backend ^&^& npm start
echo 3. Run frontend: cd frontend ^&^& npm start
echo 4. Open your browser at http://localhost:3000
echo.
echo Important: Update API keys in .env files before running!
echo Configure email settings for notifications
pause