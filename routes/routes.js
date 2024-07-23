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

router.post('/signup', userController.signup);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout); // Optional, if you want logout functionality

module.exports = router;
