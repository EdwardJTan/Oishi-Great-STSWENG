const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const cartController = require('../controllers/cartController');

describe('Cart Controller', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getCart', () => {
        it('should return an empty cart and total cost of 0 if no cart exists', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves({ items: [] }) // Ensure items is initialized
            });

            await cartController.getCart(req, res);

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(res.json.calledWith({ success: true, cart: [], totalCost: 0 })).to.be.true;
        });

        it('should return the cart and total cost if cart exists', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            const cart = {
                items: [
                    { productId: { price: 100 }, quantity: 2 },
                    { productId: { price: 50 }, quantity: 1 }
                ]
            };

            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves(cart)
            });

            await cartController.getCart(req, res);

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(res.json.calledWith({
                success: true,
                cart: cart.items,
                totalCost: 250
            })).to.be.true;
        });

        it('should handle server errors', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOne').throws(new Error('Server error'));

            await cartController.getCart(req, res);

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Server error' })).to.be.true;
        });
    });

    describe('addToCart', () => {
        it('should return 404 if product not found', async () => {
            const req = {
                body: { productId: '1', quantity: 2 },
                session: { userId: '12345' }
            };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves({ items: [] })
            });
            sandbox.stub(Product, 'findById').resolves(null);

            await cartController.addToCart(req, res);

            expect(Product.findById.calledOnce).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Product not found' })).to.be.true;
        });

        it('should handle server errors', async () => {
            const req = {
                body: { productId: '1', quantity: 2 },
                session: { userId: '12345' }
            };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOne').throws(new Error('Server error'));

            await cartController.addToCart(req, res);

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Server error' })).to.be.true;
        });
    });

    describe('updateCartQuantity', () => {
        it('should handle server errors', async () => {
            const req = {
                body: { productId: '1', type: 'plus' },
                session: { userId: '12345' }
            };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOne').throws(new Error('Server error'));

            await cartController.updateCartQuantity(req, res);

            expect(Cart.findOne.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Error updating cart' })).to.be.true;
        });
    });

    describe('checkout', () => {
        it('should delete the cart and return success message', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOneAndDelete').resolves({
                items: [{ productId: '1', quantity: 1 }]
            });

            await cartController.checkout(req, res);

            expect(Cart.findOneAndDelete.calledOnce).to.be.true;
            expect(res.json.calledWith({ success: true, message: 'Checkout successful' })).to.be.true;
        });

        it('should return an error message if the cart is empty', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOneAndDelete').resolves({ items: [] });

            await cartController.checkout(req, res);

            expect(Cart.findOneAndDelete.calledOnce).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Cart is empty' })).to.be.true;
        });

        it('should handle server errors', async () => {
            const req = { session: { userId: '12345' } };
            const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

            sandbox.stub(Cart, 'findOneAndDelete').throws(new Error('Server error'));

            await cartController.checkout(req, res);

            expect(Cart.findOneAndDelete.calledOnce).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ success: false, message: 'Server error' })).to.be.true;
        });
    });
});
