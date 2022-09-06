const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const {
  getUsers, getUser, getMe, updateUserInfo, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getMe);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUser,
);

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
      // eslint-disable-next-line no-useless-escape
      avatar: Joi.string().min(4).pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/),
    }),
  }),
  updateAvatar,
);

module.exports = userRouter;
