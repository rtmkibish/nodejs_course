const Tokens = require('../models/token');

class TokenStorage {
  getToken(token) {
    return Tokens.findOne({token: token});
  }

  addToken(token) {
    return Tokens.create({token: token});
  }

  deleteToken(token) {
    return Tokens.deleteOne({token: token});
  }
}

module.exports = new TokenStorage();