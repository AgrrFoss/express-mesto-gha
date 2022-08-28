const User = require('../models/user');
const { ERROR_SERVER, ERROR_BAD_REQ, ERROR_NOT_FOUND } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.UserId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQ).send({ message: 'Передан некорректный _id' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQ).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_REQ).send({ message: 'Неверный тип данных' });
      }
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_REQ).send({ message: 'Некорректный Id пользователя' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const newAva = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    if (newAva) {
      res.send(newAva);
    } else {
      res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    if (err.valueType !== 'string') {
      res.status(ERROR_BAD_REQ).send({ message: 'Неверный тип данных' });
    }
    if (err.name === 'CastError') {
      res.status(ERROR_BAD_REQ).send({ message: 'Передан некооректный Id пользователя' });
    } else {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере' });
    }
  }
};
