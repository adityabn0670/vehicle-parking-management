const express = require('express');
const router = express.Router();
const db = require('../utils/db');


router.get('/add', (req, res) => {
    const user_id = req.query.user_id; // Retrieve user_id from query parameters
    res.render('vehicle/add', { body: '', user_id: user_id }); // Pass the user_id and body to the add page
});

router.post('/add', (req, res) => {
    const intime = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format the intime
    const { user_id, reg_no, model, color, category } = req.body;
    console.log(user_id);
    
    // Insert vehicle details into the database
    const insertQuery = 'INSERT INTO veh_details (user_id, reg_no, model, color, category, intime) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [user_id, reg_no, model, color, category, intime], (insertErr, insertResult) => {
        if (insertErr) {
            console.error('Error inserting vehicle details:', insertErr);
            res.status(500).send('Error inserting vehicle details.');
        } else {
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
        }
    });
});

module.exports = router;
