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

// Get all savings goals for user
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM savings_goals WHERE user_id = ? ORDER BY deadline ASC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add savings goal
router.post('/', authenticateToken, (req, res) => {
  const { title, target_amount, deadline } = req.body;
  db.run(
    'INSERT INTO savings_goals (user_id, title, target_amount, deadline) VALUES (?, ?, ?, ?)',
    [req.user.id, title, target_amount, deadline],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Savings goal added successfully' });
    }
  );
});

// Update savings goal
router.put('/:id', authenticateToken, (req, res) => {
  const { title, target_amount, saved_amount, deadline } = req.body;
  db.run(
    'UPDATE savings_goals SET title = ?, target_amount = ?, saved_amount = ?, deadline = ? WHERE id = ? AND user_id = ?',
    [title, target_amount, saved_amount, deadline, req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Savings goal updated successfully' });
    }
  );
});

// Delete savings goal
router.delete('/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM savings_goals WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Savings goal deleted successfully' });
  });
});

module.exports = router;