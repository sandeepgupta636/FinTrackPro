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

// Get user's stock watchlist
router.get('/watchlist', authenticateToken, (req, res) => {
  db.all('SELECT * FROM stocks WHERE user_id = ? ORDER BY ticker ASC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add stock to watchlist
router.post('/watchlist', authenticateToken, (req, res) => {
  const { ticker, sector } = req.body;
  // Check if stock already exists
  db.get('SELECT * FROM stocks WHERE user_id = ? AND ticker = ?', [req.user.id, ticker], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (row) {
      return res.json({ message: 'Stock already in watchlist' });
    }
    // Insert new stock
    db.run(
      'INSERT INTO stocks (user_id, ticker, sector) VALUES (?, ?, ?)',
      [req.user.id, ticker, sector],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Stock added to watchlist' });
      }
    );
  });
});

// Update stock in watchlist
router.put('/watchlist/:ticker', authenticateToken, (req, res) => {
  const { quantity, buy_price, last_price, sector } = req.body;
  db.run(
    'UPDATE stocks SET quantity = ?, buy_price = ?, last_price = ?, sector = ? WHERE user_id = ? AND ticker = ?',
    [quantity, buy_price, last_price, sector, req.user.id, req.params.ticker],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Stock updated successfully' });
    }
  );
});

// Remove stock from watchlist
router.delete('/watchlist/:ticker', authenticateToken, (req, res) => {
  db.run('DELETE FROM stocks WHERE user_id = ? AND ticker = ?', [req.user.id, req.params.ticker], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Stock removed from watchlist' });
  });
});

// Get real-time stock price (mock)
router.get('/price/:ticker', async (req, res) => {
  try {
    // Fetch from external API
    const response = await axios.get(`https://api.example.com/stock/${req.params.ticker}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch stock price' });
  }
});

module.exports = router;