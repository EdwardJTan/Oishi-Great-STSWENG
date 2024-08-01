const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const orderController = require('../controllers/orderController');

describe('orderController', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('checkout', () => {
        it('should return an error if the cart is empty', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                redirect: sinon.stub()
            };
            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves(null)
            });

            await orderController.checkout(req, res);

            console.log('status called with 400:', res.status.calledWith(400));
            console.log('json called with error message:', res.json.calledWith({ error: 'Cart is empty' }));

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ error: 'Cart is empty' })).to.be.true;
        });

        it('should create a new order and delete the cart', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                redirect: sinon.stub()
            };
            const cart = {
                _id: 'cart123',
                items: [
                    { productId: { _id: 'product1', price: 10 }, quantity: 2 },
                    { productId: { _id: 'product2', price: 20 }, quantity: 1 }
                ]
            };
            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves(cart)
            });
            sandbox.stub(Order, 'findOne').returns({
                sort: sandbox.stub().resolves({ transactionId: 123 })
            });
            sandbox.stub(Order.prototype, 'save').resolves();
            sandbox.stub(Cart, 'findByIdAndDelete').resolves();

            await orderController.checkout(req, res);

            console.log('Order save called once:', Order.prototype.save.calledOnce);
            console.log('Cart findByIdAndDelete called with cart ID:', Cart.findByIdAndDelete.calledOnceWith('cart123'));
            console.log('Redirect called with /orders:', res.redirect.calledOnceWith('/orders'));

            expect(Order.prototype.save.calledOnce).to.be.true;
            expect(Cart.findByIdAndDelete.calledOnceWith('cart123')).to.be.true;
            expect(res.redirect.calledOnceWith('/orders')).to.be.true;
        });

        it('should handle errors during checkout', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().rejects(new Error('Server error'))
            });

            await orderController.checkout(req, res);

            console.log('status called with 500:', res.status.calledWith(500));
            console.log('json called with error message:', res.json.calledWith({ error: 'Error during checkout' }));

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Error during checkout' })).to.be.true;
        });

        it('should handle cases where no previous transaction ID exists', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                redirect: sinon.stub()
            };
            const cart = {
                _id: 'cart123',
                items: [
                    { productId: { _id: 'product1', price: 10 }, quantity: 2 },
                    { productId: { _id: 'product2', price: 20 }, quantity: 1 }
                ]
            };
            sandbox.stub(Cart, 'findOne').returns({
                populate: sandbox.stub().resolves(cart)
            });
            sandbox.stub(Order, 'findOne').returns({
                sort: sandbox.stub().resolves(null)
            });
            sandbox.stub(Order.prototype, 'save').resolves();
            sandbox.stub(Cart, 'findByIdAndDelete').resolves();

            await orderController.checkout(req, res);

            console.log('Order save called once:', Order.prototype.save.calledOnce);
            console.log('Cart findByIdAndDelete called with cart ID:', Cart.findByIdAndDelete.calledOnceWith('cart123'));
            console.log('Redirect called with /orders:', res.redirect.calledOnceWith('/orders'));

            expect(Order.prototype.save.calledOnce).to.be.true;
            expect(Cart.findByIdAndDelete.calledOnceWith('cart123')).to.be.true;
            expect(res.redirect.calledOnceWith('/orders')).to.be.true;
        });
    });

    describe('viewOrders', () => {
        it('should fetch and render the user\'s orders', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                render: sinon.stub()
            };
            const orders = [
                {
                    transactionId: '123',
                    products: [
                        { productId: { _id: 'product1', name: 'Product 1' }, quantity: 2 },
                        { productId: { _id: 'product2', name: 'Product 2' }, quantity: 1 }
                    ]
                }
            ];
            sandbox.stub(Order, 'find').returns({
                sort: sandbox.stub().returns({
                    populate: sandbox.stub().resolves(orders)
                })
            });

            await orderController.viewOrders(req, res);

            console.log('Render called with template and data:', res.render.calledOnceWith('Oishi Great - Orders', { orders }));

            expect(res.render.calledOnceWith('Oishi Great - Orders', { orders })).to.be.true;
        });

        it('should handle errors when fetching orders', async () => {
            const req = { session: { userId: 'user123' } };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            };
            sandbox.stub(Order, 'find').rejects(new Error('Server error'));

            await orderController.viewOrders(req, res);

            console.log('status called with 500:', res.status.calledWith(500));
            console.log('json called with error message:', res.json.calledWith({ error: 'Error fetching orders' }));

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Error fetching orders' })).to.be.true;
        });
    });
});
