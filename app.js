const express = require('express');
const { AsyncLocalStorage } = require('async_hooks');
const { v4: uuid } = require('uuid');
const { PORT, ENV } = require('./config');
const logger = require('./logger');

const Storage = require('./storage.js');
const eventStorage = new Storage();
const asyncStorage = new AsyncLocalStorage();

module.exports = { asyncStorage, eventStorage };

const router = require('./routs/events');


const requestIdMiddleware = (req, res, next) => {
  asyncStorage.run({
    requestId: uuid(),
    userId: uuid()
  }, () => {
    next();
  });
};

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use('/events', router);

app.listen(PORT, () => console.log(`Started on ${PORT} port`));

