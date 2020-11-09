const express = require('express');
const { PORT, ENV } = require('./config');
const logger = require('./logger');

const app = express();
const router = require('./routs/events');

app.use(express.json());
app.use('/events', router);

app.listen(PORT);
