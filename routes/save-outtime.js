const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

router.get('/exit', (req, res) => {
    const user_id = req.query.user_id; // Retrieve user_id from query parameters
    //console.log(user_id);
    res.render('transaction/exit', { body: '', user_id: user_id }); // Pass the user_id and body to the add page
});

router.post('/exit', (req, res) => {
    const user_id = req.body.user_id; // Retrieve user_id from the request query parameters
//console.log(user_id);
    // Get the current timestamp as the out time
    const outtime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Query to retrieve the intime and registration number of the vehicle
    const checkIntimeQuery = 'SELECT intime, reg_no FROM veh_details WHERE user_id = ?';

    // Execute the query to check the intime of the vehicle
    db.query(checkIntimeQuery, [user_id], (intimeErr, intimeResult) => {
        if (intimeErr) {
            console.error('Error fetching intime:', intimeErr);
            return res.status(500).send('An error occurred while processing your request.');
        }

        // Check if intime data was found for the user
        if (intimeResult.length > 0 && intimeResult[0].intime) {
            // Extract the intime from the result
            const intime = new Date(intimeResult[0].intime);

            // Calculate the hours difference between intime and outtime
            const hoursDiff = (new Date(outtime) - intime) / (1000 * 60 * 60);

            // Calculate the amount based on hours parked (assuming $20 per hour)
            const amount = Math.ceil(hoursDiff) * 20;

            // Generate a unique transaction ID
            const trans_id = uuidv4().slice(0, 10);

            // Extract the registration number of the vehicle
            const reg_no = intimeResult[0].reg_no;

            // Query to insert transaction details into the database
            const insertQuery = 'INSERT INTO trans_details (trans_id, amount, reg_no, user_id, outtime) VALUES (?, ?, ?, ?, ?)';

            // Execute the query to insert transaction details
            db.query(insertQuery, [trans_id, amount, reg_no, user_id, outtime], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error inserting transaction details:', insertErr);
                    return res.status(500).send('Error inserting transaction details.');
                }

                // Render the transaction display page with transaction details
                res.render('transaction/display', {
                    trans_id: trans_id,
                    amount: amount,
                    user_id: user_id,
                    reg_no: reg_no,
                    intime: intime,
                    outtime: outtime
                });
            });
        } else {
            // No intime data found for the user
            res.status(404).send('Intime not found.');
        }
    });
});

module.exports = router;

