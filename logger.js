const logger = require('pino')();
const { asyncStorage } = require('./app.js');

function info(message) {
  const state = asyncStorage.getStore()
  logger.info(Object.assign(state, message));
}

function log(message) {
  const state = asyncStorage.getStore()
  logger.log(Object.assign(state, message));
}

function debug(message) {
  const state = asyncStorage.getStore()
  logger.debug(Object.assign(state, message));
} 

function error(message) {
  const state = asyncStorage.getStore()
  console.log('store', state, 'message', message);
  logger.error(Object.assign(state, message));
}

function warn(message) {
  const state = asyncStorage.getStore()
  logger.warn(Object.assign(state, message));
}

module.exports = {
  info,
  log,
  debug,
  error,
  warn,
}