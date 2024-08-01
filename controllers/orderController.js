const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.checkout = async (req, res) => {
  try {
    console.log('Fetching cart for user:', req.session.userId);
    const cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
    
    console.log('Fetched cart:', cart);
    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty');
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let lastTransactionId = await Order.findOne().sort({ transactionId: -1 });
    lastTransactionId = parseInt(lastTransactionId?.transactionId);
    if (isNaN(lastTransactionId)) {
      lastTransactionId = 0;
    }

    console.log('Creating new order with transactionId:', lastTransactionId + 1);
    const order = new Order({
      userId: req.session.userId,
      transactionId: lastTransactionId + 1,
      products: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      })),
      amount: cart.items.reduce((total, item) => total + item.productId.price * item.quantity, 0)
    });

    await order.save();
    await Cart.findByIdAndDelete(cart._id);
    console.log('Order created and cart deleted');
    return res.redirect('/orders');
  } catch (error) {
    console.error('Error during checkout:', error);
    return res.status(500).json({ error: 'Error during checkout' });
  }
};

exports.viewOrders = async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.session.userId);
    const ordersQuery = Order.find({ userId: req.session.userId });
    console.log('Orders Query:', ordersQuery);
    const orders = await ordersQuery.sort({ transactionId: -1 }).populate('products.productId');
    console.log('Fetched orders:', orders);
    return res.render('Oishi Great - Orders', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Error fetching orders' });
  }
};

