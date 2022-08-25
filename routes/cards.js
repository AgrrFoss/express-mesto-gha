const cardsRouter = require('express').Router();
const {
  getCards, createCard, deleteCard, setLike, deleteLike,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', setLike);
cardsRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardsRouter;
