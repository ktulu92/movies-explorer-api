const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Имя пользователя',
  },
  //

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'wrong format email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Wrong login'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Wrong password'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);

// about: {
//   type: String,

//   minlength: 2,
//   maxlength: 30,
//   default: 'Исследователь',
// },

// avatar: {
//   type: String,

//   default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//   validate: {
//     validator(v) {
//       return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)/g.test(v);
//     },
//     message: 'wrong url',
//   },
// },
