const express = require('express');
const router = express.Router();
const userController = require('../controllers/User'); // Adjusted path to User controller

// Define routes
router.get('/', (req, res) => {
  res.render('Oishi Great - Home');
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


module.exports = router;
