const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { CelebrateError } = require('celebrate');

const router = require('./routers');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT,
  MONGO_URL = 'mongodb://localhost:27017/movies-explorerdb',
} = require('./controllers/config');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use('*', cors()); // ПЕРВЫМ!
app.options('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connection.on('open', () => console.log('коннект!'));
mongoose.connection.on('error', () => console.log('ошибка'));

// next();

app.use(requestLogger);

// ...

// обработчики ошибок
app.use(errors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// const auth = require('./middlewares/auth');

app.use('/', router);

app.use(errorLogger); // подключаем логгер ошибок

app.use((err, req, res, next) => {
  //  eslint-disable-next-line
  console.log({ error: err });
  if (err instanceof CelebrateError) {
    return res.status(400).send({ message: err.details.get('body').details[0].message });
  }
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  res.status(500).send({ message: err.message });
  next();
  return 0;
});

app.listen(PORT, () => {
  console.log(`application run on port ${PORT}`);
});
