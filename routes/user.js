const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/register', (req, res) => {
  res.render('user/register', { body: '' });
});

router.post('/register', (req, res) => {
  const { user_id, name, password, contact_no } = req.body;
  const query = 'INSERT INTO user (user_id, name, password, contact_no) VALUES ( ?, ?, ?, ?)';
  db.query(query, [user_id, name, password, contact_no], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred while processing your request.');
      return;
    }
    res.redirect('/user/login');
  });
});

router.get('/login', (req, res) => {
  res.render('user/login', { body: '' });
});

router.post('/login', (req, res) => {
  const { user_id, password } = req.body;
  const query = 'SELECT * FROM user WHERE user_id = ? AND password = ?';

  db.query(query, [user_id, password], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred while processing your request.');
      return;
    }

    if (result.length > 0) {
      const user_id = result[0].user_id;

      const checkIntimeQuery = 'SELECT intime FROM veh_details WHERE user_id = ?';
      db.query(checkIntimeQuery, [user_id], (intimeErr, intimeResult) => {
        if (intimeErr) {
          console.error('Error:', intimeErr);
          res.status(500).send('An error occurred while processing your request.');
          return;
        }

        if (intimeResult.length > 0 && intimeResult[0].intime) {
          // If intime exists, redirect to transaction display
          res.redirect('/save-outtime/exit?user_id=' + user_id);
        } else {
          // If intime does not exist, redirect to vehicle select
          res.redirect('/vehicle/select?user_id=' + user_id);
        }
      });
    } else {
      // If user does not exist, redirect to login
      res.redirect('/user/login');
    }
  });
});

module.exports = router;
