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

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, phone, bank_account, pan_aadhaar, is_verified FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, phone, bank_account, pan_aadhaar } = req.body;
  db.run(
    'UPDATE users SET name = ?, phone = ?, bank_account = ?, pan_aadhaar = ? WHERE id = ?',
    [name, phone, bank_account, pan_aadhaar, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Enable 2FA (simplified)
router.post('/enable-2fa', authenticateToken, (req, res) => {
  // Implement 2FA setup
  res.json({ message: '2FA enabled' });
});

module.exports = router;