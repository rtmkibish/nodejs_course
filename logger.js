const { join } = require('path');
const logger = require('pino')();
const { asyncStorage } = require(join(__dirname, 'app.js'));

function info(message) {
  if (typeof message == 'string') {
    const state = asyncStorage.getStore().message = message;
    logger.info(state);
  }
  logger.info(Object.assign(message, asyncStorage.getStore()));
}

function log(message) {
  if (typeof message == 'string') {
    const state = asyncStorage.getStore().message = message;
    logger.log(state);
  }
  logger.log(Object.assign(message, asyncStorage.getStore()));
}

function debug(message) {
  if (typeof message == 'string') {
    const state = asyncStorage.getStore().message = message;
    logger.debug(state);
  }
  logger.debug(Object.assign(message, asyncStorage.getStore()));
} 

function error(message) {
  if (typeof message == 'string') {
    const state = asyncStorage.getStore().message = message;
    logger.error(state);
  }
  logger.error(Object.assign(message, asyncStorage.getStore()));
}

function warn(message) {
  if (typeof message == 'string') {
    const state = asyncStorage.getStore().message = message;
    logger.warn(state);
  }
  logger.warn(Object.assign(message, asyncStorage.getStore()));
}

module.exports = {
  info,
  log,
  debug,
  error,
  warn,
}