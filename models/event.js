const mongoose = require('mongoose');
const {Schema} = mongoose;

const EventSchema = new Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  participantsIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  }],
  title: {
    type: String,
    required: true,
  },
  location: String,
  date: Date,
  hour: Date,
})

const Events = mongoose.model('Events', EventSchema);

module.exports = Events;