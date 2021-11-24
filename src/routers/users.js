const express = require('express');
const usersController = require('../controllers/users');
const authentic = require('../middleWare/authentic');
// const { isAdmin } = require('../middleWare/authoriz');
const upload = require('../middleWare/upload');

const usersRouter = express.Router();
usersRouter.get('/users', authentic, usersController.getList);
usersRouter.get('/users/:id', authentic, usersController.getDetail);
usersRouter.post('/register', upload, usersController.insert);
usersRouter.post('/login', usersController.login);
usersRouter.patch('/users/:id', authentic, upload, usersController.update);
usersRouter.delete('/users/:id', authentic, usersController.destroy);

module.exports = usersRouter;
