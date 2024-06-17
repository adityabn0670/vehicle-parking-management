const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Add Vehicle (new)
router.get('/add', (req, res) => {
  const user_id = req.query.user_id || '';
  res.render('vehicle/add', { user_id, body: '' });
});

router.post('/add', (req, res) => {
  const intime = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const { user_id, reg_no, model, color, category } = req.body;

  const insertVehicleQuery = 'INSERT INTO veh_details (user_id, reg_no, model, color, category, intime) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertVehicleQuery, [user_id, reg_no, model, color, category, intime], (insertVehicleErr, insertVehicleResult) => {
    if (insertVehicleErr) {
      console.error('Error inserting vehicle details:', insertVehicleErr);
      res.status(500).send('Error inserting vehicle details.');
      return;
    }

    const insertUserQuery = 'INSERT INTO reg_users (user_id, reg_no) VALUES (?, ?)';
    db.query(insertUserQuery, [user_id, reg_no], (insertUserErr, insertUserResult) => {
      if (insertUserErr) {
        console.error('Error inserting reg user details:', insertUserErr);
        res.status(500).send('Error inserting reg user details.');
        return;
      }

      const getAvailableSlotQuery = 'SELECT SlotNo FROM ParkingSlot WHERE Availability = \'Yes\' LIMIT 1;';
      db.query(getAvailableSlotQuery, (selectErr, selectResults) => {
        if (selectErr) {
          console.error('Error fetching available slot:', selectErr);
          res.status(500).send('Error fetching available slot.');
          return;
        }

        if (selectResults.length === 0) {
          console.log('No available slot found.');
          res.status(404).send('No available slot found.');
          return;
        }

        const SlotNo = selectResults[0].SlotNo;
        const updateSlotQuery = 'UPDATE ParkingSlot SET user_id = ?, Availability = \'No\' WHERE SlotNo = ?;';
        db.query(updateSlotQuery, [user_id, SlotNo], (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error allotting parking slot:', updateErr);
            res.status(500).send('Error allotting parking slot.');
            return;
          }

          console.log('Slot allotted successfully. Slot No:', SlotNo);
          res.redirect('/parking/display?slotNo=' + SlotNo);
        });
      });
    });
  });
});

// Vehicle Selection
router.get('/select', (req, res) => {
  const user_id = req.query.user_id;
  res.render('vehicle/select', { user_id });
});

router.post('/select', (req, res) => {
  const { user_id, vehicle_choice } = req.body;
  if (vehicle_choice === 'existing') {
    res.redirect('/vehicle/add-existing?user_id=' + user_id);
  } else if (vehicle_choice === 'new') {
    res.redirect('/vehicle/add?user_id=' + user_id);
  }
});

// Add Existing Vehicle
router.get('/add-existing', (req, res) => {
  const user_id = req.query.user_id;
  const query = 'SELECT reg_no FROM veh_details WHERE user_id = ?';

  db.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('An error occurred while processing your request.');
      return;
    }

    if (result.length > 0) {
      const reg_no = result[0].reg_no;
      res.render('vehicle/add-existing', { user_id, reg_no });
    } else {
      res.redirect('/vehicle/add?user_id=' + user_id);
    }
  });
});

router.post('/add-existing', (req, res) => {
  const { user_id, reg_no } = req.body;
  const intime = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const updateVehicleQuery = 'UPDATE veh_details SET intime = ? WHERE user_id = ? AND reg_no = ?';
  db.query(updateVehicleQuery, [intime, user_id, reg_no], (err, result) => {
    if (err) {
      console.error('Error updating vehicle details:', err);
      res.status(500).send('An error occurred while processing your request.');
      return;
    }

    const getAvailableSlotQuery = 'SELECT SlotNo FROM ParkingSlot WHERE Availability = \'Yes\' LIMIT 1';
    db.query(getAvailableSlotQuery, (selectErr, selectResults) => {
      if (selectErr) {
        console.error('Error fetching available slot:', selectErr);
        res.status(500).send('Error fetching available slot.');
        return;
      }

      if (selectResults.length === 0) {
        console.log('No available slot found.');
        res.status(404).send('No available slot found.');
        return;
      }

      const SlotNo = selectResults[0].SlotNo;
      const updateSlotQuery = 'UPDATE ParkingSlot SET user_id = ?, Availability = \'No\' WHERE SlotNo = ?;';
      db.query(updateSlotQuery, [user_id, SlotNo], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error allotting parking slot:', updateErr);
          res.status(500).send('Error allotting parking slot.');
          return;
        }

        console.log('Slot allotted successfully. Slot No:', SlotNo);
        res.redirect(`/parking/display?slotNo=${SlotNo}&user_id=${user_id}`);
      });
    });
  });
});

// Route to display the allocated slot
router.get('/display', (req, res) => {
  const slotNo = req.query.slotNo;
  const user_id = req.query.user_id;
  res.render('parking/display', { slotNo: slotNo, user_id: user_id });
});

module.exports = router;
