const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./fintrack.db');

// Middleware to verify admin JWT (simplified)
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    // Check if user is admin
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    req.user = user;
    next();
  });
};

// Get all users
router.get('/users', authenticateAdmin, (req, res) => {
  db.all('SELECT id, name, email, phone, is_verified, created_at FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add IPO
router.post('/ipos', authenticateAdmin, (req, res) => {
  const { name, issue_date, listing_date, min_price, max_price, lot_size } = req.body;
  db.run(
    'INSERT INTO ipos (name, issue_date, listing_date, min_price, max_price, lot_size) VALUES (?, ?, ?, ?, ?, ?)',
    [name, issue_date, listing_date, min_price, max_price, lot_size],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'IPO added successfully' });
    }
  );
});

// Get app analytics (simplified)
router.get('/analytics', authenticateAdmin, (req, res) => {
  const queries = [
    { sql: 'SELECT COUNT(*) as total_users FROM users', params: [] },
    { sql: 'SELECT COUNT(*) as total_investments FROM investments', params: [] },
    { sql: 'SELECT SUM(amount) as total_expenses FROM expenses', params: [] }
  ];

  const results = {};
  let completed = 0;

  queries.forEach((query, index) => {
    db.get(query.sql, query.params, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (index === 0) results.users = row;
      else if (index === 1) results.investments = row;
      else if (index === 2) results.expenses = row;

      completed++;
      if (completed === queries.length) {
        res.json({
          total_users: results.users.total_users,
          total_investments: results.investments.total_investments,
          total_expenses: results.expenses.total_expenses || 0
        });
      }
    });
  });
});

module.exports = router;