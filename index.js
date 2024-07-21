const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// Set up Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Define routes
app.get('/', (req, res) => {
    res.render('Oishi Great - Home');
});

app.get('/about', (req, res) => {
    res.render('Oishi Great - About');
});

app.get('/location', (req, res) => {
    res.render('Oishi Great - Location');
});

app.get('/login', (req, res) => {
    res.render('Oishi Great - Login');
});

app.get('/onlineshop', (req, res) => {
    res.render('Oishi Great - OnlineShop');
});

app.get('/signup', (req, res) => {
    res.render('Oishi Great - Signup');
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
