const express = require('express');
const router = express.Router();
const userController = require('../controllers/User');
const loginController = require('../controllers/Login'); // New controller for login

router.get('/', (req, res) => {
  res.render('Oishi Great - Home', { loggedIn: req.session.userId });
});

router.get('/about', (req, res) => {
  res.render('Oishi Great - About');
});

router.get('/location', (req, res) => {
  res.render('Oishi Great - Location');
});

router.get('/login', (req, res) => {
  res.render('Oishi Great - Login');
});

router.get('/onlineshop', (req, res) => {
  res.render('Oishi Great - OnlineShop');
});

router.get('/signup', (req, res) => {
  res.render('Oishi Great - Signup');
});

router.get('/useraddress', (req, res) => {
  res.render('Oishi Great - UserAddress');
});

router.get('/myaccount', userController.getMyAccount); // fetch user data from the database to reflect changes immediately
router.get('/editaccountdetails', userController.getEditAccountDetails); // fetch the user data from the database to reflect changes immediately

router.post('/signup', userController.signup); 
router.post('/login', loginController.login);
router.post('/logout', loginController.logout); // Optional, if you want logout functionality
router.post('/editaccountdetails', userController.updateAccountDetails);

module.exports = router;
