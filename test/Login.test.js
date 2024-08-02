const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const { expect } = chai;
const User = require('../models/User');
const userController = require('../controllers/Login'); 

describe('User Controller', () => {
    describe('login', () => {
    it('should log in the user and redirect to the homepage', async () => {
        const req = {
        body: {
            email: 'john.doe@example.com',
            password: 'password123'
        },
        session: {}
        };
        const res = {
            redirect: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        const user = {
            _id: '12345',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            dob: '1990-01-01',
            gender: 'male',
            username: 'johndoe',
            password: 'hashedpassword'
        };

        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(true);

        await userController.login(req, res);

        expect(User.findOne.calledOnce).to.be.true;
        expect(bcrypt.compare.calledOnce).to.be.true;
        expect(req.session.firstName).to.equal(user.firstName);
        expect(req.session.lastName).to.equal(user.lastName);
        expect(req.session.email).to.equal(user.email);
        expect(req.session.phone).to.equal(user.phone);
        expect(req.session.dob).to.equal(user.dob);
        expect(req.session.gender).to.equal(user.gender);
        expect(req.session.username).to.equal(user.username);
        expect(req.session.userId).to.equal(user._id);
        expect(res.redirect.calledWith('/')).to.be.true;

        User.findOne.restore();
        bcrypt.compare.restore();
    });

    it('should return a 400 status for invalid email', async () => {
        const req = {
            body: {
            email: 'invalid.email@example.com',
            password: 'password123'
            },
            session: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        sinon.stub(User, 'findOne').resolves(null);

        await userController.login(req, res);

        expect(User.findOne.calledOnce).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.send.calledWith('Invalid email or password.')).to.be.true;

        User.findOne.restore();
    });

    it('should return a 400 status for invalid password', async () => {
        const req = {
            body: {
                email: 'john.doe@example.com',
                password: 'wrongpassword'
            },
        session: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        const user = {
            email: 'john.doe@example.com',
            password: 'hashedpassword'
        };

        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(false);

        await userController.login(req, res);

        expect(User.findOne.calledOnce).to.be.true;
        expect(bcrypt.compare.calledOnce).to.be.true;
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.send.calledWith('Invalid email or password.')).to.be.true;

        User.findOne.restore();
        bcrypt.compare.restore();
    });

    it('should handle errors and return a 500 status', async () => {
        const req = {
            body: {
                email: 'john.doe@example.com',
                password: 'password123'
            },
            session: {}
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        sinon.stub(User, 'findOne').rejects(new Error('Some error occurred'));

        await userController.login(req, res);

        expect(User.findOne.calledOnce).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledWith('Error logging in. Please try again later.')).to.be.true;

        User.findOne.restore();
    });
});

    describe('logout', () => {
        it('should destroy the session and redirect to the homepage', async () => {
        const req = {
            session: {
            destroy: sinon.stub().callsFake(callback => callback(null))
            }
        };
        const res = {
            redirect: sinon.spy(),
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        await userController.logout(req, res);

        expect(req.session.destroy.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/')).to.be.true;
    });

    it('should handle errors when destroying the session', async () => {
        const req = {
            session: {
            destroy: sinon.stub().callsFake(callback => callback(new Error('Some error occurred')))
            }
        };
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.spy()
        };

        await userController.logout(req, res);

        expect(req.session.destroy.calledOnce).to.be.true;
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledWith('Error logging out. Please try again later.')).to.be.true;
        });
    });
});
