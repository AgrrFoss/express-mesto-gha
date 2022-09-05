const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getUsers, getUser, updateUserInfo, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUser);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().min(4),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
