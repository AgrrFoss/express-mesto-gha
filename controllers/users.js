const User = require('../models/user');

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
      res.status(404).send({ message: "Пользователь с указанным _id не найден." });
    }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: "Передан некорректный _id" });
      }
      res.status(500).send({ message:'Произошла ошибка на сервере.' })
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Переданы некорректные данные при создании пользователя." });
      }
      res.status(500).send({ message:"Произошла ошибка на сервере." });
    });
};
/*
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {new: true}
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.valueType !== "string") {
        return res.status(400).send({ message: "Неверный тип данных"});
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: "Пользователь не найден"});
      }
      res.status(500).send({ message:"Произошла ошибка на сервере." })
    });
};
*/

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const nameArr = name.split('');
  const aboutArr = about.split('');
  if (nameArr.length >= 2 && nameArr.length <= 30 && aboutArr.length >= 2 && aboutArr.length <=30) {
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {new: true}
    )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: "Неверный тип данных"});
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: "Пользователь не найден"});
      }
      res.status(500).send({ message:"Произошла ошибка на сервере." })
    });
  } else {
    return res.status(400).send({ message: "Неверный тип данных, Имя и Информация должны содержать от 2 до 30 символов"});
  }
};

module.exports.updateAvatar = async (req, res) => {
  try{
  const { avatar } = req.body;
  const newAva = await User.findByIdAndUpdate(req.user._id,
    { avatar },
    {new: true}
    );
  res.status(200).send(newAva)
  } catch (err) {
    if (err.valueType !== "string") {
      return res.status(400).send({ message: "Неверный тип данных"});
    };
    if (err.name === 'CastError') {
      return res.status(404).send({ message: "Пользователь не найден"});
    };
    res.status(500).send({ message: "Произошла ошибка на сервере"});
  };
};

/*
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.valueType !== "string") {
        return res.status(400).send({ message: "Неверный тип данных"});
      }
      if (err.name === 'CastError') {
        return res.status(404).send({ message: "Пользователь не найден"});
      }
      res.status(500).send(err);
    });
};
*/