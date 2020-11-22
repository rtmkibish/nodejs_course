const { v4: uuid } = require('uuid');
const { asyncStorage } = require(join('./../app.js'));

const requestIdMiddleware = (req, res, next) => {
  asyncStorage.run({
    requestId: uuid(),
    userId: uuid()
  }, () => {
    next();
  });
};

module.exports = requestIdMiddleware;