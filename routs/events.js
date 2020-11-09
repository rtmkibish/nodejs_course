const fs = require('fs');
const path = require('path');
const express = require('express');
const csv = require('csvtojson');
const { Parser } = require('json2csv');
const { EVENTSDTOPATH } = require(path.join(__dirname, '..', 'config.js'));
const { log } = require(path.join(__dirname, '..', 'logger.js'));

const router = express.Router();

router.get('/', async (req, res) => {
  const defaultSearchParams = ['id', 'title', 'location', 'date', 'hour'];
  const queryParams = Object.keys(req.query);
  const actualSerchParams = queryParams.filter(p => defaultSearchParams.includes(p));
  const events = await csv().fromFile(EVENTSDTOPATH);
  const filteredEvents = events.filter(e => {
    for (let param of actualSerchParams) {
      if (e[param] != req.query[param]) return false;
    }
    return true;
  });
  return res.json(filteredEvents);
})

router.get('/batch', async (req, res) => {
  const readStream = fs.createReadStream(EVENTSDTOPATH);
  readStream.pipe(csv()).pipe(res);
});

router.get('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  /* I know that the code belov should use await
  but I just wanted to practice a bit with Promises
  */
  csv()
    .fromFile(EVENTSDTOPATH)
    .then(data => {
      const event = data.find(e => e.id == eventId);
      return res.json(event || {error: "Event is not found"});
    })
    .catch(reason => log(reason));
});

router.post('/', (req, res) => {
  const fields = ['title', 'location', 'date', 'hour'];
  const rawEventKeys = Object.keys(req.body);
  const requiredFields = fields.filter(f => rawEventKeys.includes(f));

  if (requiredFields.length < 4) {
    return res.status(400).json({message: "One or more required fields are missed"});
  }

  requiredFields.unshift('id');
  const eventObj = requiredFields.reduce((acc, f) => {
    acc[f] = req.body[f] || '';
    return acc;
  }, {});
  eventObj.id = Date.now();
  const options = { requiredFields, quote: '' };
  try {
    const parser = new Parser(options);
    const csvEvent = parser.parse(eventObj);
    const csvValuesOnly = csvEvent.split('\n')[1] + '\n';
    fs.appendFile(EVENTSDTOPATH, csvValuesOnly, () => log('Event is added'));
    return res.json(eventObj);
  } catch (error) {
    log(error);
    return res.status(400).json({message: "Failed to create an event"});
  }
});


router.put('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const fields = ['title', 'location', 'date', 'hour'];
  const rawEventKeys = Object.keys(req.body);
  const safeForUpdateFields = fields.filter(f => rawEventKeys.includes(f));
  const updatedEvent = safeForUpdateFields.reduce((acc, f) => {
    acc[f] = req.body[f];
    return acc;
  }, {});

  csv()
    .fromFile(EVENTSDTOPATH)
    .then(jsonEventArray => {
      const eventIndex = jsonEventArray.findIndex(e => e.id == eventId);
      if (eventIndex != -1) {
        jsonEventArray[eventIndex] = {
          ...jsonEventArray[eventIndex],
          ...updatedEvent};
        fields.unshift('id');
        options = {fields, quote: ''};
        const parser = new Parser(options);
        const csvEvents = parser.parse(jsonEventArray) + '\n';
        fs.writeFile(EVENTSDTOPATH, csvEvents, () => log('Event is updated'));
        return res.json(jsonEventArray[eventIndex]);
      }
      return res.status(404).json({message: "Event id is not found"});
    })
    .catch(reason => log(reason));
});

router.delete('/:eventId', (req, res) => {
  csv()
    .fromFile(EVENTSDTOPATH)
    .then(jsonEventArray => {
      const eventIndex = jsonEventArray.findIndex(e => e.id == req.params.eventId);
      if (eventIndex != -1) {
        jsonEventArray.splice(eventIndex, 1);
        const fields = ['id', 'title', 'location', 'date', 'hour'];
        const options = {fields, quote: ''};
        const parser = new Parser(options);
        const csvEvents = parser.parse(jsonEventArray) + '\n';
        fs.writeFile(EVENTSDTOPATH, csvEvents, () => log('Event was deleted'));
        return res.status(204).send()
      }
      return res.status(404).json({message: "Event id is not found"});
    })
    .catch(reason => log(reason));
});

module.exports = router;
