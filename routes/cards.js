const carsRouter = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users')

carsRouter.get('/users', getUsers);
//router.get('/users/:userId', getUser);
carsRouter.post('/users', createUser);

module.exports = carsRouter;