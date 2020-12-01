const express = require('express');
const { join } = require('path');
const { AsyncLocalStorage } = require('async_hooks');
const { PORT, MONGO_ROUTE } = require('./config');

const asyncStorage = new AsyncLocalStorage();
module.exports = { asyncStorage };

const mongoose = require('mongoose');
mongoose.connect(
  MONGO_ROUTE,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

const authRouter = require('./routs/auth');
const eventsRouter = require('./routs/events');
const userRouter = require('./routs/users');

const requestIdMiddleware = require('./middlewares/requestTracker.js');
const { error404, error500, } = require('./middlewares/errorHandlers.js');

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/users', userRouter);
app.use(error500);
app.use(error404);

app.listen(PORT, () => console.log(`Started on ${PORT} port`));
