const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Display delete user form
router.get('/', (req, res) => {
    res.render('delete_user_form');
});

// Handle delete user form submission
router.post('/', (req, res) => {
    const { slotNo } = req.body;

    // Get the user_id associated with the SlotNo
    const getUserIdQuery = `
        SELECT user_id 
        FROM ParkingSlot 
        WHERE SlotNo = ?;
    `;

    db.query(getUserIdQuery, [slotNo], (err, results) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            res.status(500).send('Error fetching user ID.');
        } else if (results.length === 0) {
            console.log('No user found for the given SlotNo.');
            res.status(404).send('No user found for the given SlotNo.');
        } else {
            const userId = results[0].user_id;

            // First delete the intime from trans_details
            const deleteTransDetailsQuery = `
                UPDATE trans_details 
                SET intime = NULL 
                WHERE user_id = ?;
            `;

            db.query(deleteTransDetailsQuery, [userId], (deleteTransErr, deleteTransResult) => {
                if (deleteTransErr) {
                    console.error('Error deleting intime from trans_details:', deleteTransErr);
                    res.status(500).send('Error deleting intime from trans_details.');
                } else {
                    console.log('Intime deleted from trans_details successfully.');

                    // Then delete the intime from veh_details
                    const deleteVehDetailsQuery = `
                        UPDATE veh_details 
                        SET intime = NULL 
                        WHERE user_id = ?;
                    `;

                    db.query(deleteVehDetailsQuery, [userId], (deleteVehErr, deleteVehResult) => {
                        if (deleteVehErr) {
                            console.error('Error deleting intime from veh_details:', deleteVehErr);
                            res.status(500).send('Error deleting intime from veh_details.');
                        } else {
                            console.log('Intime deleted from veh_details successfully.');

                            // Finally, update the ParkingSlot to delete the user
                            const updateSlotQuery = `
                                UPDATE ParkingSlot 
                                SET user_id = NULL, Availability = 'Yes' 
                                WHERE SlotNo = ?;
                            `;

                            db.query(updateSlotQuery, [slotNo], (updateErr, updateResults) => {
                                if (updateErr) {
                                    console.error('Error updating parking slot:', updateErr);
                                    res.status(500).send('Error updating parking slot.');
                                } else {
                                    console.log(`Slot ${slotNo} updated successfully.`);
                                    res.render('delete_user_confirmation');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
