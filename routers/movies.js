const router = require('express').Router();
const { validateCreateMovie, validateMovieId } = require('../middlewares/validator');

const controller = require('../controllers/movies.js');

router.get('/movies', controller.getMovies);

router.post('/movies', validateCreateMovie, controller.createMovie);

router.delete('/:movieId', validateMovieId, controller.deleteMovie);

module.exports = router;
