const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  country: {
    // .................................
    type: String,
    required: true,
  },
  director: {
    // ................................
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },

  year: {
    // ................................
    type: String,
    required: true,
  },

  description: {
    // ................................
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: {
      validator() {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)/g;
      },
    },
    message: 'Должен быть URL',
  },

  trailer: {
    type: String,
    required: true,
    validate: {
      validator() {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)/g;
      },
    },
    message: 'Должен быть URL',
  },

  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator() {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)/g;
      },
    },
    message: 'Должен быть URL',
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  movieId: {
    type: String, // Должно браться из API Movies Explorer
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', MovieSchema);
