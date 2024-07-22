const User = require('../models/User');
const moment = require('moment');

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dob, gender, username, password } = req.body;
    
    // Validate and format the DOB
    const formattedDob = moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD');
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      dob: formattedDob,
      gender,
      username,
      password
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up. Please try again later.');
  }
};
