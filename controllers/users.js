const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadReqError = require('../errors/bad_req');
const NotFoundError = require('../errors/not_found');
const AuthError = require('../errors/auth_err');
const RepeatEmailError = require('../errors/repeat_email_error');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};
/*
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
        res.status(ERROR_BAD_REQ).send({ message: 'Передан некорректный _id юзера' });
      } else {
        res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере.' });
      }
    });
};
*/

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id юзера');
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send(user))
        .catch((e) => {
          if (e.code === 11000) {
            const err = new RepeatEmailError('Пользователь с таким Email уже зарегистрирован');
            next(err);
          }
          if (e.name === 'ValidationError') {
            const err = new BadReqError('Переданы некорректные данные при создании пользователя.');
            next(err);
          } else {
            next(e);
          }
        });
    })
    //.catch((err) => res.send(err)); Так было раньше
    .catch(next);
};

/*
module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res.status(ERROR_BAD_REQ).send({ message: `${err}Переданы некорректные данные при создании пользователя.` });
          } else {
            res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере.' });
          }
        });
    })
    .catch((err) => res.send(err));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send(token);
      })
      .catch((err) => {
        res
          .status(401)
          .send({ message: err.message });
      });
  };
*/
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        '4jsx',
        { expiresIn: '7d' },
      );
      //res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .end();
    })
    .catch((e) => {
      const err = new AuthError('Почта или пароль не правильные');
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new BadReqError('Неверный тип данных');
        next(err);
      }
      if (e.name === 'CastError') {
        const err = new BadReqError('Передан некорректный _id юзера');
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const newAva = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (newAva) {
      res.send(newAva);
    } else {
      throw new NotFoundError(`${req.user._id}Пользователь с указанным _id не найден.`);
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      const err = new BadReqError('Неверный тип данных. Введите ссылку на изображение');
      next(err);
    }
    if (e.name === 'CastError') {
      const err = new BadReqError('Передан некорректный _id юзера');
      next(err);
    } else {
      next(e);
    }
  }
};
