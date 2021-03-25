const Movie = require('../models/movie');

const ServerError = require('../errors/ServerError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
// const BadRequestError = require('../errors/BadRequestError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(() => next(new ServerError('Ошибка на сервере')));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner = req.user._id,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
    movieId,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(new ServerError(err)));
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findByIdAndDelete(movieId)
    .orFail(() => {
      throw new NotFoundError('Такой карточки нет');
    })

    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        movie.remove().then((movieToDelete) => res.status(200).send({ data: movieToDelete }));
      } else {
        throw new ForbiddenError('Удалять можно только свои карточки');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
