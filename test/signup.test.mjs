// test/signup.test.mjs
import { expect } from 'chai';
import { handleNextStep, handlePrevStep, handleSubmit } from '../script/signupHandler.js';

function createMockElement() {
    return {
        classList: {
        add: () => {},
        remove: () => {}
        }
    };
}

describe('Signup Handlers', function() {
    describe('handleNextStep', function() {
        it('should move to the next step and update progress', function() {
            const slidePage = { style: { marginLeft: "" } };
            const bullet = [{ classList: { add: () => {} } }];
            const progressCheck = [{ classList: { add: () => {} } }];
            const progressText = [{ classList: { add: () => {} } }];
            let current = 1;
            current = handleNextStep(slidePage, bullet, progressCheck, progressText, current, 1);
            expect(slidePage.style.marginLeft).to.equal("-25%");
            expect(current).to.equal(2);
        });
    });

    describe('handlePrevStep', function() {
        it('should move to the previous step and update progress', function() {
            const slidePage = { style: { marginLeft: "" } };
            const bullet = [{ classList: { remove: () => {} } }];
            const progressCheck = [{ classList: { remove: () => {} } }];
            const progressText = [{ classList: { remove: () => {} } }];
            let current = 2;
            current = handlePrevStep(slidePage, bullet, progressCheck, progressText, current, 0);
            expect(slidePage.style.marginLeft).to.equal("0%");
            expect(current).to.equal(1);
        });
    });
});
