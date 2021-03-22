const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Авторизируйтесь');
  }

  const token = autorization.replace('Bearer ', ' ');
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
