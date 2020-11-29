const mongoose = require('mongoose');
const Users = require('../models/user');
const Events = require('../models/event');

class UserStorage {
  filterUsers(filter) {
    Users.find(filter);
  }

  getUser(id) {
    return Users.findById(id).populate('createdEvents');
  }

  createUser(user) {
    const newUser = new Users(user);
    return newUser.save();
  }

  updateUser(id) {
    return;
  }

  async deleteUser(id) {
    try {
      const user = await Users.findById(id);
      if (!user) throw new Error('invalid user');
      await Events.deleteMany({
        _id: {
          $in: user.createdEvents
        }
      })
      await Users.deleteOne({_id: user._id});
      return Promise.resolve();
    } catch (err) {
      throw err;
    }
  }

}

module.exports = new UserStorage();