const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});

const Tokens = mongoose.model('Tokens', refreshTokenSchema);

module.exports = Tokens;