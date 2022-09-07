const Card = require('../models/card');
const BadReqError = require('../errors/bad_req');
const NotFoundError = require('../errors/not_found');
const NoRightsError = require('../errors/no_rights');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (e) {
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError('Переданы некорректные данные при создании карточки');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким _id не найдена.');
      } else {
        const idString = String(card.owner);
        if (idString === req.user._id) {
          Card.deleteOne(card)
            .then(() => res.send({ message: 'Карточка удалена' }))
            .catch(next);
        } else {
          throw new NoRightsError('Вы не можете удалить чужую карточку');
        }
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный Id карточки.');
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.setLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      throw new NotFoundError('Карточка с таким _id не найдена.');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный Id карточки.');
      next(err);
    } else {
      next(e);
    }
  }
};

module.exports.deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.send(card);
    } else {
      throw new NotFoundError('Карточка с таким _id не найдена.');
    }
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный Id карточки.');
      next(err);
    } else {
      next(e);
    }
  }
};
