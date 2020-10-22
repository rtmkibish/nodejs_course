function log(message) {
  console.log(message);
}

function debug(message) {
  console.debug(message);
} 

function error(message) {
  console.error(message);
}

function warn(message) {
  console.warn(message);
}

module.exports = {
  log,
  debug,
  error,
  warn,
}