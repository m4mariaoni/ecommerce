const db = require('../db');

module.exports = class ProductModel {

  /**
   *   // List all products or filter by category
   * @param  {Object} options [Query options]
   * @return {Array}          [Array of products]
   */
  async find(options = {}) {
    try {
      let statement = `SELECT * FROM products`;
      const values = [];

      if (options.category) {
        statement += ` WHERE category_id = $1`;
        values.push(options.category);
      }

      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];
    } catch (err) {
      throw err;
    }
  }
  /**
   * Retrieve product by ID
   * @param  {Object}      id [Product ID]
   * @return {Object|null}    [Product record]
   */
  async findOne(id) {
    try {

      const statement = `SELECT *
                         FROM products
                         WHERE id = $1`;
      const values = [id];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw err;
    }
  }

  /**
   * Retrieve by category ID
   * @param {Object} categoryId [Category ID]
   * @return {Object|null}      [Product record]
   */

    /* async findByCategory(categoryId){
      try {
              const statement = `SELECT * from products
              WHERE category_Id = $1`;

              const values = [categoryId];

              const result = await db.query(statement,values);
              if (result.rows?.length) {
                return result.rows[0]
              }
          
              return null;
        
            }catch(err) {
              throw err;
      }
    }*/
} 