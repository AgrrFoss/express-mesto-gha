const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.status(200).send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send({ message: 'Карточка удалена'});
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};
/*
module.exports.setLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.status(201).send(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: `Ошибка. Передан некорректный _id карточки.` });
    }
    res.status(500).send({ message: `Произошла ошибка на сервере` });
  }
};
*/

module.exports.setLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if(card) {
    res.status(201).send(card);
    } else {
      return res.status(404).send({ message: `Ошибка. Карточка с таким _id не найдена` });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: `Ошибка. Передан некорректный _id карточки.` });
    }
    res.status(500).send({ message: `Произошла ошибка на сервере` });
  }
};

module.exports.deleteLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if(card) {
      res.status(201).send(card);
      } else {
        return res.status(404).send({ message: `Ошибка. Карточка с таким _id не найдена` });
      }
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).send({ message: 'Передан несуществующий _id карточки.' });
    }
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};
