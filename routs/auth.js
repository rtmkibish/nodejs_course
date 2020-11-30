const { Router } = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userStorage = require('../storages/userStorage');
const tokenStorage = require('../storages/tokenStorage');
const checkAccessToken = require('../middlewares/authCheck');
const createToken = require('../tools/createToken');

const router = new Router();

router.post('/login', (req, res, next) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({error: "user id is missed"});
  userStorage.getUser(userId)
    .then(user => {
      if (!user) res.status(400).json({error: 'invalid user id'});
      const accessToken = createToken({user: user._id}, config.ACCESS_TOKEN_SECRET);
      const refreshToken = createToken({user: user._id}, config.REFRESH_TOKEN_SECRET, '2m');
      tokenStorage.addToken(refreshToken)
        .then(token => {
          res.json({
            access_token: accessToken,
            refresh_token: token.token
          });
        })
        .then(reason => reason);
    })
    .catch(reason => next(reason))
})

router.post('/refresh', (req, res, next) => {
  const refreshToken = req.body.refresh_token;
  const userId = req.body.userId;
  if (!refreshToken) return res.status(401).json({error: "no token provided"})
  tokenStorage.getToken(refreshToken)
    .then(token => {
      if (!token) return res.status(403).json({error: "access denied"});
      jwt.verify(token.token, config.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          tokenStorage.deleteToken(token.token).exec();
          return res.status(403).json({error: "invalid or expired token"});
        }
        tokenStorage.deleteToken(token.token)
          .then(info => {
            if (info.ok !== 1) return res.status(500).json({error: "failed to refresh"});
            const newTokens = {
              access_token: createToken({user:  user.user}, config.ACCESS_TOKEN_SECRET),
              refresh_token: createToken({user: user.user}, config.REFRESH_TOKEN_SECRET, '30s')
            };
            tokenStorage.addToken(newTokens.refresh_token)
              .then(() => {
                res.json(newTokens);
              })
              .catch(reason => reason);
        })
        .catch(reason => reason);
      })
    })
    .catch(reason => next(reason));
})

router.delete('/revoke', (req, res, next) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({error: "user id is missed"});
  tokenStorage.deleteToken(token)
    .then(info => {
      if (info.ok !== 1) return res.status(500).json({error: "unable to delete token"});
      res.sendStatus(204);
    })
    .catch(reason => next(next));
})

router.get('/check', checkAccessToken, (req, res) => {
  res.json({valid: true, user: req.user});
})

module.exports = router;