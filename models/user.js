const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      sparse: true,
    },
    validate: {
      validator: function(fieldValue) {
        return fieldValue.indexOf('@') > 0;
      },
      message: 'Invalid email',
    }
  },
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Events',
  }],
  firstName: String,
  lastName: String
})

const Users = mongoose.model('Users', UserSchema);
module.exports = Users;