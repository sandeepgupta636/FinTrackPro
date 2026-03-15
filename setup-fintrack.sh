#!/bin/bash
# =================================================
# FinTrackPro Full-stack Setup Script (Linux/macOS)
# =================================================

echo "Starting FinTrackPro setup..."

# --- 1 Install PostgreSQL ---
echo "Installing PostgreSQL..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    brew install postgresql
    brew services start postgresql
fi
echo "PostgreSQL installed and running"

# --- 2 Create Database and User ---
echo "Creating database and user..."
sudo -i -u postgres psql <<EOF
CREATE DATABASE fintrackdb;
CREATE USER fintrackuser WITH ENCRYPTED PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE fintrackdb TO fintrackuser;
\q
EOF
echo "Database 'fintrackdb' and user 'fintrackuser' created"

# --- 3 Create backend .env file ---
echo "Setting up backend environment variables..."
mkdir -p backend
cat > backend/.env <<EOL
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
EOL
echo "Backend .env created at backend/.env"

# --- 4 Install backend dependencies ---
echo "Installing backend dependencies..."
cd backend
npm install express pg dotenv cors bcryptjs jsonwebtoken axios nodemailer helmet express-rate-limit ws node-cron
cd ..
echo "Backend dependencies installed"

# --- 5 Create frontend .env file ---
echo "Setting up frontend environment variables..."
mkdir -p frontend
cat > frontend/.env <<EOL
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_STOCK_API_KEY=your_stock_api_key
REACT_APP_NEWS_API_KEY=your_news_api_key
EOL
echo "Frontend .env created at frontend/.env"

# --- 6 Install frontend dependencies ---
echo "Installing frontend dependencies..."
cd frontend
npm install axios recharts react-router-dom formik yup jwt-decode react-icons
cd ..
echo "Frontend dependencies installed"

# --- 7 Instructions to run ---
echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. Run backend: cd backend && npm start"
echo "2. Run frontend: cd frontend && npm start"
echo "3. Open your browser at http://localhost:3000"
echo ""
echo "Important: Update API keys in .env files before running!"
echo "Configure email settings for notifications"