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

// Get all investments for user
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM investments WHERE user_id = ? ORDER BY buy_date DESC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add investment
router.post('/', authenticateToken, (req, res) => {
  const { type, name, ticker, quantity, buy_price, buy_date } = req.body;
  db.run(
    'INSERT INTO investments (user_id, type, name, ticker, quantity, buy_price, buy_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, type, name, ticker, quantity, buy_price, buy_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Investment added successfully' });
    }
  );
});

// Update investment
router.put('/:id', authenticateToken, (req, res) => {
  const { type, name, ticker, quantity, buy_price, buy_date, current_price } = req.body;
  db.run(
    'UPDATE investments SET type = ?, name = ?, ticker = ?, quantity = ?, buy_price = ?, buy_date = ?, current_price = ? WHERE id = ? AND user_id = ?',
    [type, name, ticker, quantity, buy_price, buy_date, current_price, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Investment updated successfully' });
    }
  );
});

// Delete investment
router.delete('/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM investments WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Investment deleted successfully' });
  });
});

// Get portfolio summary
router.get('/portfolio/summary', authenticateToken, (req, res) => {
  db.all(`
    SELECT type, SUM(quantity * buy_price) as total_invested, SUM(quantity * COALESCE(current_price, buy_price)) as current_value
    FROM investments
    WHERE user_id = ?
    GROUP BY type
  `, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;