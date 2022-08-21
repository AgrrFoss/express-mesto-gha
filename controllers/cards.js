const Card = require('../models/card');
/*
module.exports.getUsers = (req, res) => {
  User.create...
};

module.exports.getUser = (req, res) => {
  User.create...
};
*/
module.exports.createCard = (req, res) => {
  const { name, about, avatar } = req.body;
  Card.create({ name, about, avatar })
    .then(user => res.send( { data: user }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};