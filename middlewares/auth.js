const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../controllers/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Авторизируйтесь');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET); // добавить jwt ключ
  } catch (err) {
    throw new UnauthorizedError('Авторизируйтесь');
  }

  req.user = payload;
  next();
};
module.exports = auth;
