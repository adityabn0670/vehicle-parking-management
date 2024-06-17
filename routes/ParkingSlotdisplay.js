const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/view', (req, res) => {
    const query = 'SELECT SlotNo, Availability, user_id FROM ParkingSlot';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching parking slot data:', err);
            res.status(500).send('Error fetching parking slot data.');
        } else {
            res.render('parking/view', { parkingSlots: results });
        }
    });
});

module.exports = router;
