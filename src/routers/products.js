const express = require('express');
const productsController = require('../controllers/products');
const authentic = require('../middleWare/authentic');
const { isAdmin } = require('../middleWare/authoriz');
const upload = require('../middleWare/upload');

const productsRouter = express.Router();
productsRouter.get('/products', authentic, productsController.getList);
productsRouter.get('/products/:id', authentic, productsController.getDetail);
productsRouter.post('/products', authentic, isAdmin, upload, productsController.insert);
productsRouter.patch('/products/:id', authentic, isAdmin, upload, productsController.update);
productsRouter.delete('/products/:id', authentic, isAdmin, productsController.destroy);

module.exports = productsRouter;
