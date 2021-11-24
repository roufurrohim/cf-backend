/* eslint-disable no-console */
const mysql = require("mysql2");
const { HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = require("../helpers/env");

const db = mysql.createConnection({
  host: HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("connection failed");
  } else {
    console.log("Connection Success");
  }
});

module.exports = db;
