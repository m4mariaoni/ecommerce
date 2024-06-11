const authRouter = require('./auth');
const userRouter = require('./user');
const productRouter = require('./product');
const cartRouter = require('./cart');
const orderRouter = require('./order');

module.exports = (app, passport) => {
    authRouter(app, passport);
    userRouter(app);
    productRouter(app);
    cartRouter(app);
    orderRouter(app);
}