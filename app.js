const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
// const { CelebrateError } = require('celebrate');
const { NotFoundError } = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/errorHandler');

const router = require('./routers');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, MONGO_URL } = require('./controllers/config');
require('dotenv').config();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use('*', cors()); // ПЕРВЫМ!
app.options('*', cors());

app.use('/', router);

mongoose.connection.on('open', () => console.log('коннект!'));
mongoose.connection.on('error', () => console.log('ошибка'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(errorLogger); // подключаем логгер ошибок

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`application run on port ${PORT}`);
});
