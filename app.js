const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const usersRouter = require("./src/routers/users");
const productsRouter = require("./src/routers/products");
// const categoryRouter = require('./src/routers/category');
// const sizeRouter = require('./src/routers/size');
const transactionRouter = require("./src/routers/transaction");
// const detailsTransactionRouter = require('./src/routers/detailsTransaction');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(usersRouter);
app.use(productsRouter);
// app.use(categoryRouter);
// app.use(sizeRouter);
app.use(transactionRouter);
// app.use(detailsTransactionRouter);
app.use(express.static(__dirname + "/uploads"));
app.use("/helpers", express.static(__dirname + "/manifestImg"));

const { PORT = 3004, LOCAL_ADDRESS = "0.0.0.0" } = process.env;

app.listen(PORT, LOCAL_ADDRESS, () => {
  console.log(`Service running on port ${PORT}`);
});

module.exports = app;
