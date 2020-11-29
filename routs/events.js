const express = require('express');
const { error } = require('../logger');
const eventStorage = require('../storages/eventStorage');

const router = express.Router();

router.get('/', (req, res) => {
  const defaultSearchParams = ['id', 'title', 'location', 'date', 'hour'];
  const queryParams = Object.keys(req.query);
  const actualSerchParams = queryParams.filter(p => defaultSearchParams.includes(p));

  const filterObject = actualSerchParams.reduce((acc, f) => {
    acc[f] = req.query[f];
    return acc;
  }, {})

  eventStorage.findEvents(filterObject)
    .then(events => {
      res.json(events);
    })
    .catch(reason => next(reason))
})

router.get('/batch', async (req, res) => {
  const readStream = eventStorage.batchEvents();
  readStream.pipe(res);
});

router.get('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  eventStorage.getEvent(eventId)
    .then(event => {
      if (event) {
        res.json(event)
      } else {
        res.status(404).json({error: "Event is not found"})
      }
    })
    .catch(reason => next(reason))
});

router.post('/', (req, res, next) => {
  eventStorage.addEvent(req.body)
    .then(event => res.json(event))
    .catch(reason => next(reason))
});


router.put('/:eventId', (req, res, next) => {
  const eventId = req.params.eventId;
  const updatedEvent = {...req.body, id: eventId};
  eventStorage.updateEvent(updatedEvent)
    .then(event => res.json(event))
    .catch(reason => next(reason))
});

router.delete('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  eventStorage.deleteEvent(eventId)
    .then(() => {
      res.status(204).send()
    })
    .catch(reson => next(reason));
});

module.exports = router;
