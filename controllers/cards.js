const Card = require('../models/card');
const { ERROR_SERVER, ERROR_BAD_REQ, ERROR_NOT_FOUND } = require('../utils/constants');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(ERROR_BAD_REQ).send({ message: 'Переданы некорректные данные при создании карточки' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const deleteCard = await Card.findByIdAndRemove(req.params.cardId);
    if (deleteCard) {
      res.send({ message: 'Карточка удалена' });
    } else {
      res.status(ERROR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(ERROR_BAD_REQ).send({ message: 'Некорректный Id карточки.' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.setLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка. Карточка с таким _id не найдена' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(ERROR_BAD_REQ).send({ message: 'Ошибка. Передан некорректный _id карточки.' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};

module.exports.deleteLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      res.status(ERROR_NOT_FOUND).send({ message: 'Ошибка. Карточка с таким _id не найдена' });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(ERROR_BAD_REQ).send({ message: 'Передан некорректный _id карточки.' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};
