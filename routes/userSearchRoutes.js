const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Render the search user page
router.get('/search-user', (req, res) => {
  res.render('admin/searchUser', { userData: null }); // Pass null initially
});

// Handle the search user form submission
router.post('/search-user', (req, res) => {
  const userId = req.body.userId;

  const query = `
    SELECT u.*, v.reg_no, v.model, v.color, v.category, v.intime, ps.SlotNo
    FROM user u
    JOIN veh_details v ON u.user_id = v.user_id
    JOIN ParkingSlot ps ON u.user_id = ps.user_id
    WHERE u.user_id = ?
`;

  db.query(query, userId, (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.render('admin/searchUser', { userData: null }); // Pass null if user not found
      return;
    }

    res.render('admin/searchUser', { userData: results[0] });
  });
});

module.exports = router;
