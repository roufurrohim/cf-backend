/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
const db = require("../config/db");

const transactionModel = {
  getList: (field, typeSort, limit, offset, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT transaction.id AS id_transaction, transaction.delivery_method, transaction.address, transaction.payment_method, transaction.remark, transaction.subtotal, transaction.shipping, transaction.tax, transaction.total, transaction.user_id FROM transaction WHERE user_id='${id}' LIMIT ${limit}`,

        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  // getList: (field, typeSort, limit, offset) => new Promise((resolve, reject) => {
  //   db.query(
  //     `SELECT dt.id AS id_details, products_id, products.name AS name_product, qty, price, transaction_id, transaction.delivery_method, transaction.payment_method, transaction.time, transaction.remark, transaction.subtotal, transaction.shipping, transaction.total,  user_id FROM details_transaction AS dt LEFT JOIN products ON dt.products_id = products.id LEFT JOIN transaction ON dt.transaction_id = transaction.id INNER JOIN users ON transaction.user_id = users.id ORDER BY ${field} ${typeSort} LIMIT ${limit} OFFSET ${offset}`,
  //     (err, result) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(result);
  //       }
  //     },
  //   );
  // }),
  getDetails: (id) =>
    new Promise((resolve, reject) => {
      db.query(
        `SELECT dt.id AS id_details, dt.transaction_id, dt.price AS price_product, dt.qty, dt.products_id, products.name AS name_product FROM details_transaction AS dt LEFT JOIN products ON dt.products_id = products.id LEFT JOIN transaction ON dt.transaction_id = transaction.id INNER JOIN users ON transaction.user_id = users.id WHERE transaction.id=${id}`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  insert: (body) =>
    new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO transaction (address, delivery_method, payment_method, remark, subtotal, shipping, tax, total, user_id) VALUES (
        '${body.address}','${body.delivery_method}','${body.payment_method}','${body.remark}','${body.subtotal}', '${body.shipping}','${body.tax}','${body.total}','${body.user_id}')`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            const dataDetails = body.details;
            const transactionId = result.insertId;
            const details = dataDetails.map((e) => {
              db.query(
                `INSERT INTO details_transaction (products_id, qty, price, transaction_id) VALUES ('${e.products_id}', '${e.qty}', '${e.price}', '${transactionId}')`,
                (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    return;
                  }
                }
              );
            });
            Promise.all(details)
              .then(() => {
                resolve(result);
              })
              .catch((err) => {
                reject(err);
              });
          }
        }
      );
    }),
  update: (body, id) =>
    new Promise((resolve, reject) => {
      db.query(
        `UPDATE transaction set address=${body.address},
         delivery_method='${body.delivery_method}',payment_method='${body.payment_method}',time=${body.time},remark=${body.remark},subtotal=${body.subtotal},shipping=${body.shipping},total=${body.total},
         user_id=${body.user_id}
        where id_transaction='${id}'`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    }),
  destroy: (id) =>
    new Promise((resolve, reject) => {
      db.query(`DELETE FROM transaction WHERE id=${id}`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          db.query(
            `DELETE FROM details_transaction WHERE transaction_id=${id}`,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                return;
              }
            }
          );
          resolve(result);
        }
      });
    }),
};

module.exports = transactionModel;
