const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const { CelebrateError } = require('celebrate');
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

// next();

// ...

// обработчики ошибок

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// const auth = require('./middlewares/auth');

// Сделать как в вебинаре
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;
//   res.status(statusCode).send({
//     message: statusCode === 500 ? 'Ошибка сервера' : message,
//   });
//   next();
// });
app.use(errorLogger); // подключаем логгер ошибок

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
// app.use((err, req, res, next) => {
//   //  eslint-disable-next-line
//   console.log({ error: err });
//   if (err instanceof CelebrateError) {
//     return res.status(400).send({ message: err.details.get('body').details[0].message });
//   }
//   if (err.status) {
//     return res.status(err.status).send({ message: err.message });
//   }
//   res.status(500).send({ message: err.message });
//   next();
//   return 0;
// });
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`application run on port ${PORT}`);
});
