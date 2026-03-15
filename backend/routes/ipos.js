const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
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

// Get upcoming IPOs
router.get('/upcoming', (req, res) => {
  db.all('SELECT * FROM ipos WHERE issue_date >= date("now") ORDER BY issue_date ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Apply for IPO
router.post('/apply/:ipoId', authenticateToken, (req, res) => {
  const { applied_shares, applied_price } = req.body;
  db.run(
    'INSERT INTO user_ipos (user_id, ipo_id, applied_shares, applied_price) VALUES (?, ?, ?, ?)',
    [req.user.id, req.params.ipoId, applied_shares, applied_price],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'IPO application submitted successfully' });
    }
  );
});

// Get user's applied IPOs
router.get('/applied', authenticateToken, (req, res) => {
  db.all(`
    SELECT ui.*, i.name, i.issue_date, i.listing_date
    FROM user_ipos ui
    JOIN ipos i ON ui.ipo_id = i.id
    WHERE ui.user_id = ?
    ORDER BY i.issue_date DESC
  `, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Update IPO status (admin or cron job)
router.put('/:id/status', authenticateToken, (req, res) => {
  // Implement status update logic
  res.json({ message: 'IPO status updated' });
});

module.exports = router;