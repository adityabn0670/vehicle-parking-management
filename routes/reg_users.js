const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Define the route for fetching registered users
router.get('/reg_users', (req, res) => {
    const regUsersQuery = `
        SELECT ru.user_id, ru.reg_no
        FROM reg_users ru;
    `;

    db.query(regUsersQuery, (err, results) => {
        if (err) {
            console.error('Error fetching reg_users data:', err);
            res.status(500).send('Error fetching reg_users data.');
        } else {
            res.render('transaction/reg_users', { regUsers: results });
        }
    });
});

module.exports = router;
