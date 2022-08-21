const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  console.log(req);
};
/*
module.exports.getUser = (req, res) => {
  User.create...
};
*/
module.exports.createUser = (req, res) => {
  console.log(req);
  const data = req.body;
  User.create(data)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));

};