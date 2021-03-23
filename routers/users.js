const router = require('express').Router();
const { validateLogin, validateProfile } = require('../middlewares/validator');
const controller = require('../controllers/users');

router.get('/', controller.getUsers);
router.get('users/me', controller.getUserInfo);

router.get('/:id', validateLogin, controller.getUser);

router.patch('users/me', validateProfile, controller.updateProfile);

module.exports = router;
