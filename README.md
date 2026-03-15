# FinTrackPro - Investment & Finance Tracker

A comprehensive web application for personal finance and investment management.

## Features

### User Management
- User registration and authentication
- Profile management with bank account and PAN/Aadhaar details
- Two-factor authentication support
- Password reset functionality

### Dashboard
- Net worth overview (Assets - Liabilities)
- Portfolio summary with real-time updates
- Upcoming IPO notifications
- Recent transactions display
- Savings goal progress tracking

### Expense & Savings Tracker
- Add, edit, and delete expenses with categorization
- Savings goal setting and tracking
- Recurring expense management
- Visual analytics with pie and bar charts

### Investment Tracker
- Support for stocks, mutual funds, ETFs, and crypto
- Real-time portfolio value calculation
- Profit/Loss tracking and ROI analysis
- Investment performance graphs

### IPO Tracker
- Upcoming IPO listings and subscription options
- IPO application status tracking
- First-day performance analysis
- Notification alerts for IPO events

### Stock Market Watchlist
- Real-time stock price updates
- Sector-wise performance analysis
- Profit/Loss calculator
- News and alert integration

### Reports & Analytics
- Monthly and yearly expense reports
- Investment performance analysis
- Sector-wise exposure reports
- Customizable charts and visualizations

### Notifications & Alerts
- Price change alerts
- IPO reminders
- Savings milestone notifications
- Dividend payout alerts

### Admin Panel
- User management
- IPO data management
- System analytics
- Content management

## Tech Stack

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- WebSocket for real-time data
- Cron jobs for scheduled tasks

### Frontend
- React.js with hooks
- TailwindCSS for styling
- React Router for navigation
- Recharts for data visualization
- Axios for API calls

## Quick Setup

### Automated Setup Scripts

For a quick start, use one of the provided setup scripts:

#### Windows (PowerShell)
```powershell
.\setup-fintrack.ps1
```

#### Windows (Command Prompt)
```batch
setup-fintrack.bat
```

#### Linux/macOS
```bash
chmod +x setup-fintrack.sh
./setup-fintrack.sh
```

These scripts will:
- Install PostgreSQL (if not already installed)
- Create database and user
- Set up environment variables
- Install all dependencies
- Provide instructions to start the application

### Manual Installation

#### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database and update `.env` file with your database credentials

4. Run database migrations:
   ```bash
   # Run the init.sql script in your PostgreSQL database
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Environment Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fintrackdb
DB_USER=fintrackuser
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
PORT=5000
STOCK_API_KEY=your_stock_api_key
NEWS_API_KEY=your_news_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_STOCK_API_KEY=your_stock_api_key
REACT_APP_NEWS_API_KEY=your_news_api_key
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Expenses
- `GET /api/expenses` - Get user expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Savings
- `GET /api/savings` - Get savings goals
- `POST /api/savings` - Add savings goal
- `PUT /api/savings/:id` - Update savings goal
- `DELETE /api/savings/:id` - Delete savings goal

## 🚀 Deployment

### Option 1: Vercel (Recommended for Frontend + Backend)

1. **Connect your GitHub repository to Vercel**
2. **Deploy the backend:**
   - Vercel will automatically detect the `vercel.json` configuration
   - Set environment variables in Vercel dashboard
   - Backend will be deployed to a serverless function

3. **Deploy the frontend:**
   - Create a separate Vercel project for the frontend
   - Set `REACT_APP_BACKEND_URL` to your backend URL

### Option 2: Render (Full-Stack)

1. **Connect your GitHub repository to Render**
2. **Use the `render.yaml` configuration file**
3. **Deploy both services:**
   - Backend service with Node.js runtime
   - Frontend service with static site runtime
4. **Set environment variables in Render dashboard**

### Option 3: Railway

1. **Connect your GitHub repository to Railway**
2. **Railway will auto-detect your project structure**
3. **Set environment variables**
4. **Deploy both frontend and backend from single repository**

### Option 4: Heroku

1. **Create two Heroku apps:**
   - One for backend (`fintrackpro-backend`)
   - One for frontend (`fintrackpro-frontend`)

2. **Deploy backend:**
   ```bash
   heroku create fintrackpro-backend
   heroku buildpacks:add heroku/nodejs
   git push heroku main
   ```

3. **Deploy frontend:**
   ```bash
   heroku create fintrackpro-frontend
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add heroku/static
   git push heroku main
   ```

### Environment Variables for Production

```env
NODE_ENV=production
JWT_SECRET=your_secure_jwt_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
DATABASE_URL=your_database_url
STOCK_API_KEY=your_stock_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## 📱 Mobile App

Future plans include a React Native mobile application with the same features.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React.js community
- TailwindCSS team
- All contributors and supporters

### Investments
- `GET /api/investments` - Get user investments
- `POST /api/investments` - Add new investment
- `PUT /api/investments/:id` - Update investment
- `DELETE /api/investments/:id` - Delete investment
- `GET /api/investments/portfolio/summary` - Get portfolio summary

### IPOs
- `GET /api/ipos/upcoming` - Get upcoming IPOs
- `POST /api/ipos/apply/:ipoId` - Apply for IPO
- `GET /api/ipos/applied` - Get applied IPOs

### Stocks
- `GET /api/stocks/watchlist` - Get stock watchlist
- `POST /api/stocks/watchlist` - Add stock to watchlist
- `DELETE /api/stocks/watchlist/:ticker` - Remove stock from watchlist

### Reports
- `GET /api/reports/dashboard` - Get dashboard data
- `GET /api/reports/expenses` - Get expense reports
- `GET /api/reports/investments` - Get investment reports

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User account information
- `expenses` - User expenses with categorization
- `savings_goals` - Savings goals and progress
- `investments` - Investment portfolio data
- `ipos` - IPO information
- `user_ipos` - User IPO applications
- `stocks` - Stock watchlist
- `notifications` - User notifications

## Future Enhancements

- Mobile app development (React Native)
- AI-powered investment recommendations
- Bank account integration
- Tax report generation
- Social features for portfolio sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.