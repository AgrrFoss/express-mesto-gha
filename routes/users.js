const userRouter = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users')

userRouter.get('/users', getUsers);
//userRouter.get('/users/:userId', getUser);
userRouter.post('/', createUser);

module.exports = userRouter;