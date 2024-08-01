const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const Product = require('../models/Product');
const productController = require('../controllers/productController'); // Ensure this is the correct controller

describe('productController - getOnlineShop', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should fetch and render products for the online shop', async () => {
        const req = {}; // Mock request object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
            render: sinon.stub()
        };

        const products = [
            { _id: 'product1', name: 'Product 1', price: 10 },
            { _id: 'product2', name: 'Product 2', price: 20 }
        ];
        
        sandbox.stub(Product, 'find').resolves(products);

        await productController.getOnlineShop(req, res);

        console.log('Render called with template and data:', res.render.calledOnceWith('Oishi Great - OnlineShop', { products }));

        expect(res.render.calledOnceWith('Oishi Great - OnlineShop', { products })).to.be.true;
    });

    it('should handle errors when fetching products', async () => {
        const req = {}; // Mock request object
        const res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        };

        sandbox.stub(Product, 'find').rejects(new Error('Server error'));

        await productController.getOnlineShop(req, res);

        console.log('status called with 500:', res.status.calledWith(500));
        console.log('send called with Server Error:', res.send.calledWith('Server Error'));

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.send.calledWith('Server Error')).to.be.true;
    });
});
