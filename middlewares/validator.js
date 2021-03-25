const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');

const checkUrl = (value) => {
  if (!isURL(value)) {
    return new CelebrateError('Должен быть URL');
  }

  return value;
};

const validateLogin = celebrate({
  // Валидация логирования
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
});

const validateProfile = celebrate({
  // Валидация изменения данных пользователя
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});
// Валидация создания фильма
const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().custom(checkUrl).required(),
    trailer: Joi.string().custom(checkUrl).required(),
    thumbnail: Joi.string().custom(checkUrl).required(),
    movieId: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().min(24).max(24),
  }),
});

module.exports = {
  validateLogin,
  validateProfile,
  // validateAvatar,
  validateCreateMovie,
  validateMovieId,
  validateUserId,
};
