const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// router.get('/add', (req, res) => {
//     res.render('transaction/add', { body: '' }); // Pass an empty string for the body
//   });

router.post('/add', (req, res) => {

  const query = 'INSERT INTO trans_details (trans_id, amount,reg_no,user_id) VALUES (?, ?)';
  db.query(query, [transId, amount,reg_no,user_id], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;