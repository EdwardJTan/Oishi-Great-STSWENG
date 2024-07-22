const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Set up Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

// Load routes
const routes = require('./routes/routes');  // Updated path to routes.js
app.use('/', routes);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
