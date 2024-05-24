const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/register', (req, res) => {
  res.render('admin/register', { body: '' }); // Pass an empty string for the body
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO admin_login (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.get('/login', (req, res) => {
  res.render('admin/login', { body: '' }); // Pass an empty string for the body
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM admin_login WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.redirect('/'); // Logged in
    } else {
      res.redirect('/admin/login'); // Invalid credentials
    }
  });
});

module.exports = router;