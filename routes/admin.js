const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Render the login page
router.get('/login', (req, res) => {
  res.render('admin/login', { body: '' }); // Pass an empty string for the body
});

// Handle the login form submission
router.post('/login', (req, res) => {
  const { admin_id, password } = req.body;
  
  // Query the database for admin credentials
  const query = `SELECT * FROM admin_login WHERE admin_id = ? AND password = ?`;
  db.query(query, [admin_id, password], (err, results) => {
    if (err) {
      console.error(err);
      res.redirect('/admin/login'); // Redirect back to login in case of an error
    } else {
      // Check if any matching admin credentials were found
      if (results.length > 0) {
        res.redirect('/admin/dashboard'); // Redirect to admin dashboard if login is successful
      } else {
        res.redirect('/admin/login'); // Redirect back to login if credentials are invalid
      }
    }
  });
});

// Render the admin dashboard
router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', { body: '' }); // Pass an empty string for the body
});

module.exports = router;
