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

// Get all expenses for user
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add expense
router.post('/', authenticateToken, (req, res) => {
  const { category, amount, date, note, is_recurring } = req.body;
  db.run(
    'INSERT INTO expenses (user_id, category, amount, date, note, is_recurring) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, category, amount, date, note, is_recurring],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Expense added successfully' });
    }
  );
});

// Update expense
router.put('/:id', authenticateToken, (req, res) => {
  const { category, amount, date, note, is_recurring } = req.body;
  db.run(
    'UPDATE expenses SET category = ?, amount = ?, date = ?, note = ?, is_recurring = ? WHERE id = ? AND user_id = ?',
    [category, amount, date, note, is_recurring, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Expense updated successfully' });
    }
  );
});

// Delete expense
router.delete('/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Expense deleted successfully' });
  });
});

module.exports = router;