const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

router.get('/exit', (req, res) => {
  const user_id = req.query.user_id;
  res.render('transaction/exit', { body: '', user_id: user_id });
});

router.post('/exit', (req, res) => {
  const user_id = req.body.user_id;
  const outtime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const checkIntimeQuery = 'SELECT intime, reg_no FROM veh_details WHERE user_id = ?';

  db.query(checkIntimeQuery, [user_id], (intimeErr, intimeResult) => {
    if (intimeErr) {
      console.error('Error fetching intime:', intimeErr);
      return res.status(500).send('An error occurred while processing your request.');
    }

    if (intimeResult.length > 0 && intimeResult[0].intime) {
      const intime = new Date(intimeResult[0].intime);
      const hoursDiff = (new Date(outtime) - intime) / (1000 * 60 * 60);
      const amount = Math.ceil(hoursDiff) * 20;
      const trans_id = uuidv4().slice(0, 10);
      const reg_no = intimeResult[0].reg_no;

      // Insert into trans_details table
      const insertQuery = 'INSERT INTO trans_details (trans_id, amount, reg_no, user_id, intime, outtime) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [trans_id, amount, reg_no, user_id, intimeResult[0].intime, outtime], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting transaction details:', insertErr);
          return res.status(500).send('Error inserting transaction details.');
        }

        console.log('Transaction details inserted successfully.');

        res.render('transaction/display', {
          trans_id: trans_id,
          amount: amount,
          user_id: user_id,
          reg_no: reg_no,
          intime: intimeResult[0].intime,
          outtime: outtime
        });
      });
    } else {
      res.status(404).send('Intime not found.');
    }
  });
});

module.exports = router;
