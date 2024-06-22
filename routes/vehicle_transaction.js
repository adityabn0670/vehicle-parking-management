const express = require('express');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) => {
    const sqlQuery = `
    SELECT 
    veh_details.reg_no,
    veh_details.model,
    veh_details.color,
    veh_details.category,
    -- veh_details.intime AS veh_intime,
    veh_details.user_id,
    user.name AS user_name,
    trans_details.trans_id,
    trans_details.amount,
    trans_details.outtime,
    trans_details.intime1,
    ps.SlotNo
FROM 
    veh_details
LEFT JOIN 
    trans_details ON veh_details.reg_no = trans_details.reg_no
LEFT JOIN 
    user ON veh_details.user_id = user.user_id
LEFT JOIN
    parkingslot ps ON veh_details.user_id = ps.user_id
`;


    db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('Error fetching vehicle transactions:', err);
            return res.status(500).send('Internal Server Error');
        }
        console.log(results); // Log the results to check if user_name is present
        res.render('admin/vehicle_transaction', { transactions: results });
    });
});

module.exports = router;
