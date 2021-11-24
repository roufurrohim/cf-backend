const express = require('express');
const transactionController = require('../controllers/transaction');
const authentic = require('../middleWare/authentic');
const { isUser } = require('../middleWare/authoriz');

const transactionRouter = express.Router();
transactionRouter.get('/transaction/:id', authentic, transactionController.getList);
transactionRouter.get('/transaction-details/:id', authentic, isUser,transactionController.getDetail);
transactionRouter.post('/transaction', authentic, isUser,transactionController.insert);
transactionRouter.patch('/transaction/:id', authentic, isUser, transactionController.update);
transactionRouter.delete('/transaction/:id', authentic, isUser, transactionController.destroy);

module.exports = transactionRouter;
