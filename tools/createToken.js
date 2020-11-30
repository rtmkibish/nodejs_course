const jwt = require('jsonwebtoken');

function createToken(payload, signKey, expirstionTime = '15s') {
  return jwt.sign(payload, signKey, {expiresIn: expirstionTime});
}

module.exports = createToken;