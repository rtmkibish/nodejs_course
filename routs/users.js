const express = require('express');
const userStorage = require('../storages/userStorage');
const router = express.Router();

router.get('/', (req, res, next) => {
  const safeFields = ['email', 'firstName', 'lastName'];
  const filter = safeFields.reduce((acc, field) => {
    if (req.body[field]) {
      return acc[field] = req.body[field];
    } else {
      return acc;
    }
  }, {})
  userStorage.filterUsers(filter)
    .then(users => {
      const safeUsers = users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      }));
      res.json(safeUsers);
    })
    .catch(reason => {
      console.log(reason);
      next(reason);
    })
});

router.get('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  userStorage.getUser(userId)
    .then(user => res.json(user))
    .catch(reason => next(reason));
});

router.post('/', (req, res, next) => {
  userStorage.createUser(req.body)
    .then(user => res.json(user))
    .catch(reason => {
      console.error(reason);
      next(reason);
    })
})

router.put('/:userId', (req, res, next) => {
  res.end();
})

router.delete('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  userStorage.deleteUser(userId)
    .then(() => res.status(204).end())
    .catch(err  => next(err));
});

module.exports = router;