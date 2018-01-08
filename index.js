const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { PORT, CLIENT_ORIGIN } = require('./config');
require('dotenv').config();

const { dbConnect } = require('./db-mongoose');
const { dbConnect } = require('./db-knex');

const usersRouter = require('./users/router');

const app = express();

app.use(morgan(
  process.env.NODE_ENV === 'production'
  ? 'common'
  : 'dev', {
  skip: (req, res) => process.env.NODE_ENV === 'test',
}));

app.use(cors({ origin: CLIENT_ORIGIN }));
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use('/api/auth', authRouter);

app.use('/users', usersRouter);

function runServer(port = PORT) {
  const server = app.listen(port, () => {
    console.info(`App listening on port ${server.address().port}`);
  }).on('error', err => {
    console.error('Express failed to start');
    console.error(err);
  });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {
  app,
};
