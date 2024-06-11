const db = require('../db');
const moment = require('moment');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class OrderItemModel {

  constructor(data = {}) {
    this.order_id = data.order_id || null;
    this.product_id = data.id;
    this.quantity = data.quantity || 1;
    this.price = data.price || 0;
    this.created_at = data.created_at || moment.utc().toISOString();
  }

  /**
   * Creates a new order item
   * @param  {Object}      data [Order item data]
   * @return {Object|null}      [Created order item]
   */
  static async create(data) {
    try {


    // Extract column names from the first item (assuming consistent structure)
    const columns = Object.keys(data[0]);

    // Generate SQL statement using helper for dynamic parameter injection
    const cs = new pgp.helpers.ColumnSet(columns, { table: 'orderitems' });
    const statement = pgp.helpers.insert(data, cs) + 'RETURNING *';


      // Generate SQL statement - using helper for dynamic parameter injection
    //  const statement = pgp.helpers.insert(data, null, 'orderitems') + 'RETURNING *';
 
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
   * Retrieve order items for an order
   * @param  {Object} orderId [Order ID]
   * @return {Array}          [Created cart item]
   */
  static async find(orderId) {
    try {

      // Generate SQL statement
      const statement = `SELECT 
                            oi.quantity,
                            oi.id AS "cartItemId", 
                            p.*
                         FROM "orderitems" oi
                         INNER JOIN products p ON p.id = oi."productId"
                         WHERE "order_id" = $1`
      const values = [orderId];
  
      // Execute SQL statment
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];

    } catch(err) {
      throw new Error(err);
    }
  }

}