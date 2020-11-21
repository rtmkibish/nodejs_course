const express = require('express');
const { join } = require('path');
const { AsyncLocalStorage } = require('async_hooks');
const { PORT, ENV } = require('./config');

const asyncStorage = new AsyncLocalStorage();
module.exports = { asyncStorage };

const router = require('./routs/events.js');
const requestIdMiddleware = require('./middlewares/requestTracker.js');
const { error404, error500, } = require('./middlewares/errorHandlers.js');

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use('/events', router);
app.use(error500);
app.use(error404);

app.listen(PORT, () => console.log(`Started on ${PORT} port`));
