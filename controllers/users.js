const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
// const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
// const ForbiddenError = require('../errors/ForbiddenError');
const { JWT_SECRET } = require('./config');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      next(new ServerError('Ошибка на сервере'));
    });
};

const getUser = (req, res, next) => {
  // const { id } = req.params;
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Email уже зарегистрирован');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.send({
        name,
        email,
        _id,
      });
    })

    .catch(next);
};
// some-secret-code
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        // добавить ключ
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next); // исправить ошибку
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => next(new UnauthorizedError('Неверный логин или пароль'))); // исправить ошибку
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;
  // const user = User.findById(_id);
  // if (!user) {
  //   throw new NotFoundError('Пользователь не найден');
  // }
  return User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      const { name, email } = user;
      const userData = { name, email };

      res.send(userData);
    })
    .catch(next);
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  login,
  getUserInfo,
};
