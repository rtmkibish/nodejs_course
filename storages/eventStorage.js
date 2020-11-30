const Events = require('../models/event');

class Storage {

  getEvent(id) {
    return Events.findById(id).populate('participantsIds');
  }

  addEvent(eventObj) {
    const event = new Events(eventObj);
    return event.save();
  }

  updateEvent(event) {
    return Events.findByIdAndUpdate(event.id, event, {new: true});
  }

  deleteEvent(id) {
    return Events.findOneAndDelete(id);
  }

  findEvents(filter) {
    return Events.find(filter);
  }
}


module.exports = new Storage();