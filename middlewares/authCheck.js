const jwt = require('jsonwebtoken');
const config = require('../config');
const userStorage = require('../storages/userStorage');

function checkAccessToken(req, res, next) {
  const authHeader = req.header('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({error: "invalid access token"})
    req.user = user;
    next();
  });
}

module.exports = checkAccessToken;