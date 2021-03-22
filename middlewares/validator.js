const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');

const checkUrl = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError({ message: 'Должен быть URL' });
  }
  return value;
};

const validateLogin = celebrate({
  // Валидация логирования
  body: Joi.object().keys({
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
    name: Joi.string().required().min(2).max(30),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((value) => {
        checkUrl(value);
      }),

    trailer: Joi.string()
      .required()
      .custom((value) => {
        checkUrl(value);
      }),

    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        checkUrl(value);
      }),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().min(24).max(24),
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
