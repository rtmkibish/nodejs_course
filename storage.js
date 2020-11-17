const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const { Parser, parseAsync } = require('json2csv');
const { v4: uuid } = require('uuid');
const { EVENTSDTOPATH } = require(path.join(__dirname, 'config.js'));

class Storage {
  place = EVENTSDTOPATH;
  requiredFields = ['id', 'title', 'location', 'date', 'hour'];

  batchEvents() {
    return fs.createReadStream(this.place).pipe(csv());
  }

  getEvent(id) {
    return csv()
      .fromFile(this.place)
      .then(data => {
        const event = data.find(e => e.id == id);
        return event;
      })
  }

  addEvent(eventObj) {
    eventObj.id = uuid();
    const options = {
      requiredFields: this.requiredFields,
      quote: ''
    };
    return parseAsync(eventObj, options)
      .then(csvEvent => {
        const csvValuesOnly = csvEvent.split('\n')[1] + '\n';
        fs.appendFileSync(this.place, csvValuesOnly);
        return eventObj;
      })
  }

  updateEvent(event) {
    return csv()
      .fromFile(this.place)
      .then(jsonEventArray => {
        const originEventIndex = jsonEventArray.findIndex(e => e.id == event.id);
        jsonEventArray[originEventIndex] = {
          ...jsonEventArray[originEventIndex],
          ...event
        };
        const options = {
          fields: this.requiredFields,
          quote: ''
        };
        const parser = new Parser(options);
        const csvEvents = parser.parse(jsonEventArray) + '\n';
        fs.writeFileSync(this.place, csvEvents);
        return jsonEventArray[originEventIndex];
      })
      .catch(reason => {
        throw reason;
      });
  }

  deleteEvent(id) {
    return csv()
      .fromFile(this.place)
      .then(jsonEventArray => {
        const eventIndex = jsonEventArray.findIndex(e => e.id == id);
        jsonEventArray.splice(eventIndex, 1);
        const options = {
          fields: this.requiredFields,
          quote: ''
        };
        const parser = new Parser(options);
        const csvEvents = parser.parse(jsonEventArray) + '\n';
        fs.writeFileSync(EVENTSDTOPATH, csvEvents);
        return
      })
      .catch(reason => {
        throw reason;
      })
  }

  findEvents(filter) {
    return csv()
      .fromFile(this.place)
      .then(eventsArray => {
        const filterEvents = eventsArray.filter(e => {
          for (const f in filter) {
            if (e[f] != filter[f]) return false;
          }
          return true;
        })
        return filterEvents;
      })
      .catch(reason => {
        throw reason;
      })
  }
}

module.exports = Storage;