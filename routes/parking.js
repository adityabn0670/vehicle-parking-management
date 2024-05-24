const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Route to allocate a parking slot and render the display page
router.post('/add', (req, res) => {
    const query = `SELECT SlotNo FROM ParkingSlot WHERE Availability = 'Yes' LIMIT 1`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching available slot:', err);
            res.status(500).send('Error fetching available slot.');
        } else if (result.length === 0) {
            console.log('No available slot found.');
            res.status(404).send('No available slot found.');
        } else {
            const SlotNo = result[0].SlotNo;
            const intime = new Date().toLocaleString();
            const updateQuery = `UPDATE ParkingSlot SET Availability = 'No' WHERE SlotNo = ?`;

            db.query(updateQuery, [SlotNo], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error allotting parking slot:', updateErr);
                    res.status(500).send('Error allotting parking slot.');
                } else {
                    console.log('Slot allotted successfully. Slot No:', SlotNo);
                    res.redirect('/parking/display?slotNo=' + SlotNo); // Redirect to display slot page
                }
            });
        }
    });
});

// Route to display the allocated slot
router.get('/display', (req, res) => {
    const slotNo = req.query.slotNo; // Retrieve slotNo from query parameters
    res.render('parking/display', { slotNo: slotNo }); // Pass the slotNo to the display page
});

module.exports = router;
