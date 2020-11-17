const express = require('express');
const { join } = require('path');
const { AsyncLocalStorage } = require('async_hooks');
const { PORT, ENV } = require('./config');

const asyncStorage = new AsyncLocalStorage();
const Storage = require('./storage.js');
const eventStorage = new Storage();

module.exports = { asyncStorage, eventStorage };


const logger = require('./logger');
const router = require(join(__dirname, 'routs', 'events.js'));
const requestIdMiddleware = require(join(__dirname, 'middlewares', 'requestTracker.js'));
const { error404, error500, } = require(join(__dirname, 'middlewares', 'errorHandlers.js'));

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use('/events', router);
app.use(error500);
app.use(error404);

app.listen(PORT, () => console.log(`Started on ${PORT} port`));

