// test/validate.test.mjs
import { expect } from 'chai';
import { checkEmail, checkPass } from '../script/validate.js';

describe('Validators', function() {
    describe('checkEmail', function() {
        it('should return "Valid" for a valid email address', function() {
            expect(checkEmail('test@example.com')).to.equal('Valid');
        });

        it('should return "Enter a valid email address" for an invalid email address', function() {
            expect(checkEmail('invalid-email')).to.equal('Enter a valid email address');
        });

        it('should return "Enter a valid email address" for an empty email', function() {
            expect(checkEmail('')).to.equal('Enter a valid email address');
        });
    });

    describe('checkPass', function() {
        it('should return "Valid" for a non-empty password', function() {
            expect(checkPass('mypassword')).to.equal('Valid');
        });

        it('should return "Password can\'t be blank" for an empty password', function() {
            expect(checkPass('')).to.equal("Password can't be blank");
        });
    });
});
