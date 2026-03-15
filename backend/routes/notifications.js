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

// Get user's notifications
router.get('/', authenticateToken, (req, res) => {
  db.all('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Mark notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  db.run(
    'UPDATE notifications SET status = \'read\' WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
});

// Create notification (internal use)
router.post('/', authenticateToken, (req, res) => {
  const { type, message } = req.body;
  db.run(
    'INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)',
    [req.user.id, type, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Notification created successfully' });
    }
  );
});

// Delete notification
router.delete('/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM notifications WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Notification deleted' });
  });
});

module.exports = router;