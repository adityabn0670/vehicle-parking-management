const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse URL-encoded bodies (from form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const vehicleRoutes = require('./routes/vehicle');
const parkingRoutes = require('./routes/parking');
// const transactionRoutes = require('./routes/transaction');
const saveouttimeRoutes = require('./routes/save-outtime');
const regUsersRoutes = require('./routes/reg_users');
const ParkingSlotdisplayroutes=require('./routes/ParkingSlotdisplay');
const deleteUserRoutes = require('./routes/delete_user');
const userSearchRoutes = require('./routes/userSearchRoutes'); 
const vehicleTransactionRoute = require('./routes/vehicle_transaction');


app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/parking', parkingRoutes);
// app.use('/transaction', transactionRoutes);
app.use('/save-outtime', saveouttimeRoutes);
app.use('/transaction', regUsersRoutes);
app.use('/parking',ParkingSlotdisplayroutes);
app.use('/delete_user', deleteUserRoutes);
app.use('/admin',userSearchRoutes);
app.use('/vehicle-transaction', vehicleTransactionRoute);

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/contact.html'));
});
app.get('/', (req, res) => {
  res.render('index', { body: '' }); // Pass an empty string for the body initially
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
