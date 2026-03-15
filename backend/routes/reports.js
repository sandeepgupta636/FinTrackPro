const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./fintrack.db');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get expense report
router.get('/expenses', authenticateToken, (req, res) => {
  const { start_date, end_date } = req.query;
  db.all(`
    SELECT category, SUM(amount) as total
    FROM expenses
    WHERE user_id = ? AND date BETWEEN ? AND ?
    GROUP BY category
    ORDER BY total DESC
  `, [req.user.id, start_date, end_date], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get investment performance report
router.get('/investments', authenticateToken, (req, res) => {
  db.all(`
    SELECT type, name, quantity, buy_price, current_price,
           (quantity * current_price) - (quantity * buy_price) as profit_loss,
           ((current_price - buy_price) * 100.0 / buy_price) as roi
    FROM investments
    WHERE user_id = ?
    ORDER BY roi DESC
  `, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get dashboard summary
router.get('/dashboard', authenticateToken, (req, res) => {
  // Get all data in parallel
  const queries = [
    {
      sql: 'SELECT SUM(quantity * COALESCE(current_price, buy_price)) as total_investments FROM investments WHERE user_id = ?',
      params: [req.user.id]
    },
    {
      sql: 'SELECT SUM(amount) as total_expenses FROM expenses WHERE user_id = ? AND date >= date("now", "-30 days")',
      params: [req.user.id]
    },
    {
      sql: 'SELECT SUM(saved_amount) as total_savings FROM savings_goals WHERE user_id = ?',
      params: [req.user.id]
    }
  ];

  const results = {};
  let completed = 0;

  queries.forEach((query, index) => {
    db.get(query.sql, query.params, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (index === 0) results.investments = row;
      else if (index === 1) results.expenses = row;
      else if (index === 2) results.savings = row;

      completed++;
      if (completed === queries.length) {
        const netWorth = (results.investments.total_investments || 0) +
                        (results.savings.total_savings || 0) -
                        (results.expenses.total_expenses || 0);

        res.json({
          net_worth: netWorth,
          total_investments: results.investments.total_investments || 0,
          monthly_expenses: results.expenses.total_expenses || 0,
          total_savings: results.savings.total_savings || 0
        });
      }
    });
  });
});

module.exports = router;