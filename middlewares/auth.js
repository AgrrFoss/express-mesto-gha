const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация. отсутствует токен' });
  }
  const token = req.cookies.jwt;
  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '4jsx');
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
