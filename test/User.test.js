const chai = require('chai');
const sinon = require('sinon');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { expect } = chai;
const User = require('../models/User');
const userController = require('../controllers/User'); // Adjust the path if needed

describe('User Controller', () => {
  describe('signup', () => {
    it('should create a new user and redirect to login page', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          dob: '1990-01-01',
          gender: 'male',
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        redirect: sinon.spy()
      };

      const formattedDob = moment(req.body.dob, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        dob: formattedDob,
        gender: req.body.gender,
        username: req.body.username,
        password: req.body.password
      });

      sinon.stub(User.prototype, 'save').resolves();

      await userController.signup(req, res);

      expect(User.prototype.save.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/login')).to.be.true;

      User.prototype.save.restore();
    });

    it('should handle errors and send a 500 response', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
          dob: '1990-01-01',
          gender: 'male',
          username: 'johndoe',
          password: 'password123'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.spy()
      };

      sinon.stub(User.prototype, 'save').rejects(new Error('Some error occurred'));

      await userController.signup(req, res);

      expect(User.prototype.save.calledOnce).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.send.calledWith('Error signing up. Please try again later.')).to.be.true;

      User.prototype.save.restore();
    });
  });
});
