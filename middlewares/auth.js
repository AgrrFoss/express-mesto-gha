const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth_err');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    const err = new AuthError('Необходима авторизация. отсутствует токен');
    next(err);
    return;
  }
  /*
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Необходима авторизация. отсутствует токен' });
  }
  */
  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '4jsx');
  } catch (e) {
    const err = new AuthError('Необходима авторизация. Ваш токен не действителен');
    next(err);
    return;
  }

  req.user = payload;
  next();
};
