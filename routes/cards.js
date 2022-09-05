const { celebrate, Joi } = require('celebrate');
const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);

cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(7),
    }),
  }),
  createCard,
);

cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCard,
);

cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  setLike,
);

cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteLike,
);

module.exports = cardsRouter;
