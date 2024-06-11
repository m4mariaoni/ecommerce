const createError = require('http-errors');
const CartModel = require('../models/cart');
const OrderModel = require('../models/order');
const OrderItemModel = require('../models/orderItem');
const CartItemModel = require('../models/cartItem');
const moment = require('moment');

module.exports = class CartService {

  async create(data) {
    const { userId } = data;

    try {

      // Instantiate new cart and save
      const Cart = new CartModel();
      const cart = await Cart.create(userId);

      return cart;

    } catch(err) {
      throw err;
    }

  };

  async loadCart(cartId) {
    try {
      // Load user cart based on ID
      //const cart = await CartModel.findOneByUser(userId);

      // Load cart items and add them to the cart record
      const items = await CartItemModel.find(cartId);
      //cart.items = items;

      return items;

    } catch(err) {
      throw err;
    }
  }

  async addItem(userId, item) {
    try {
      // Load user cart based on ID
      const cart = await CartModel.findOneByUser(userId);

      // Create cart item
      const cartItem = await CartItemModel.create(item);

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async removeItem(cartItemId) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.delete(cartItemId);

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async updateItem(cartItemId, data) {
    try {
      // Remove cart item by line ID
      const cartItem = await CartItemModel.update(cartItemId, data);

      return cartItem;

    } catch(err) {
      throw err;
    }
  }

  async checkout(cartId, userId, paymentInfo) {
    try {

    /*   const stripe = require('stripe')('sk_test_FOY6txFJqPQvJJQxJ8jpeLYQ'); */

      // Load cart items
      const cartItems = await CartItemModel.find(cartId);

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return total += Number(item.price);
      }, 0);

      // Generate initial order
      const Order = new OrderModel({ totalamount:total, user_id:userId });

      const cartitems = Order.addItems(cartItems);

      const newOrder = await Order.create();

      const items = cartitems.map(item => ({
        order_id: newOrder.id,
        product_id : item.product_id,
        quantity : item.quantity,
        price:item.price,
        created_at: moment.utc().toISOString()
      }));


       
      await OrderItemModel.create(items);
      

     /*  // Make charge to payment method (not required in this project)
      const charge = await stripe.charges.create({
        amount: total,
        currency: 'usd',
        source: paymentInfo.id,
        description: 'Codecademy Charge'
      }); */

      // On successful charge to payment method, update order status to COMPLETE
      const order = Order.update({ status: 'COMPLETE' });

      return order;

    } catch(err) {
      throw err;
    }
  }

}