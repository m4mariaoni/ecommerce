const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });
const OrderItem = require('./orderItem');

module.exports = class OrderModel {

  constructor(data = {}) {
    this.created_at = data.created_at || moment.utc().toISOString();
    this.updated_at = moment.utc().toISOString();
    this.status = data.status || 'PENDING';
    this.totalamount = data.totalamount || 0;
    this.user_id = data.user_id || null;
  }

  addItems(items) {
    this.items = items.map(item => new OrderItem(item));
    return this.items;
  }

  /**
   * Creates a new order for a user
   * @return {Object|null}        [Created order record]
   */
  async create() {
    try {

       /*  const { created_at, updated_at, status, totalamount, user_id } = this;
        const order = { created_at, updated_at, status, totalamount, user_id }; */

        const { items, ...order } = this;

        //const order = Object.assign({}, this); // Create a shallow copy


      // Generate SQL statement - using helper for dynamic parameter injection
      const statement = pgp.helpers.insert(order, null, 'orders') + ' RETURNING *';

      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows?.length) {

        // Add new information generated in the database (ie: id) to the Order instance properties
        Object.assign(this, result.rows[0]);

        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Updates an order for a user
   * @param  {Object}      id   [Order ID]
   * @param  {Object}      data [Order data to update]
   * @return {Object|null}      [Updated order record]
   */
  async update(data) {
    try {

      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id: this.id });
      const statement = pgp.helpers.update(data, null, 'orders') + condition;
  
      // Execute SQL statment
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Loads orders for a user
   * @param  {number} userId [User ID]
   * @return {Array}         [Order records]
   */
  static async findByUser(userId) {
    try {

      // Generate SQL statement
      const statement = `SELECT *
                         FROM orders
                         WHERE "user_id" = $1`;
      const values = [userId];
  
      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve order by ID
   * @param  {number}      orderId [Order ID]
   * @return {Object|null}         [Order record]
   */
  static async findById(orderId) {
    try {

      // Generate SQL statement
      const statement = `SELECT *
                         FROM orders
                         WHERE id = $1`;
      const values = [orderId];
  
      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

}