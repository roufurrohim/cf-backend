const db = require('../config/db');

const sizeModel = {
  getList: (search, field, typeSort, limit, offset) => new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM size_products WHERE size LIKE '%${search}%' ORDER BY ${field} ${typeSort} LIMIT ${limit} OFFSET ${offset}`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  getAll: () => new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM size_products ',
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  getDetail: (id) => new Promise((resolve, reject) => {
    db.query(`SELECT * FROM size_products WHERE id=${id}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
  insert: (body) => new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO size_products (size, price, code_products) VALUE ("${body.size}", ${body.price}, ${body.code_products})`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  update: (id, body) => new Promise((resolve, reject) => {
    db.query(
      `UPDATE size_products SET size="${body.size}", price=${body.price}, code_products=${body.code_products} WHERE id='${id}'`,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  }),
  destroy: (id) => new Promise((resolve, reject) => {
    db.query(`DELETE FROM size_products WHERE id= '${id}'`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }),
};

module.exports = sizeModel;
