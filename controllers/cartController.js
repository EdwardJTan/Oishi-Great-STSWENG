const Product = require('../models/Product');
const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
        if (!cart) {
            return res.json({ success: true, cart: [], totalCost: 0 });
        }

        const totalCost = cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

        res.json({ success: true, cart: cart.items, totalCost });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, price } = req.body;
        let cart = await Cart.findOne({ userId: req.session.userId });
        if (!cart) {
            cart = new Cart({ userId: req.session.userId, items: [] });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (productIndex > -1) {
            cart.items[productIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: product.price });
        }
        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
        const totalCost = updatedCart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

        res.json({ success: true, cart: updatedCart.items, totalCost });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateCartQuantity = async (req, res) => {
    const { productId, type } = req.body;
    try {
        const cart = await Cart.findOne({ userId: req.session.userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

        const productIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (productIndex > -1) {
            if (type === 'plus') {
                cart.items[productIndex].quantity += 1;
            } else if (type === 'minus') {
                cart.items[productIndex].quantity -= 1;
                if (cart.items[productIndex].quantity <= 0) {
                    cart.items.splice(productIndex, 1);
                }
            }
        } else {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
        const totalCost = updatedCart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

        res.json({ success: true, cart: updatedCart.items, totalCost });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Error updating cart' });
    }
};

exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: req.session.userId });
        if (!cart || cart.items.length === 0) {
            return res.json({ success: false, message: 'Cart is empty' });
        }
        res.json({ success: true, message: 'Checkout successful' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
