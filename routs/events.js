const path = require('path');
const express = require('express');
const { error } = require(path.join(__dirname, '..', 'logger.js'));
const { eventStorage } = require(path.join(__dirname, '..', 'app.js'));

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
  const rawEvent = req.body;
  const fields = ['title', 'location', 'date', 'hour'];
  const rawEventKeys = Object.keys(rawEvent);
  const requiredFields = fields.filter(f => rawEventKeys.includes(f));
  const requiredKeysNumber = 4;

  if (requiredFields.length < requiredKeysNumber) {
    return res.status(400).json({message: "One or more required fields are missed"});
  }

  requiredFields.unshift('id');
  const eventObj = requiredFields.reduce((acc, f) => {
    acc[f] = rawEvent[f] || '';
    return acc;
  }, {});

  eventStorage.addEvent(eventObj)
    .then(event => res.json(event))
    .catch(reason => next(reason))
});


router.put('/:eventId', (req, res, next) => {
  const eventId = req.params.eventId;
  
  eventStorage.getEvent(eventId)
    .then(event => {
      if (!event) {
        return res.status(404).json({error: "Event is not found"});
      }
      const fields = ['title', 'location', 'date', 'hour'];
      const rawEventKeys = Object.keys(req.body);
      const safeForUpdateFields = fields.filter(f => rawEventKeys.includes(f));
      const updatedEvent = safeForUpdateFields.reduce((acc, f) => {
        acc[f] = req.body[f];
        return acc;
      }, {id: eventId});
    
      eventStorage.updateEvent(updatedEvent)
        .then(event => res.json(event))
        .catch(reason => {
          next(reason);
        })
    })
    .catch(reason => next(reason))
});

router.delete('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  eventStorage.getEvent(eventId)
    .then(event => {
      if (!event) {
        return res.status(404).json({error: "Event is not found"});
      }
      eventStorage.deleteEvent(event.id)
        .then(() => {
          res.status(204).send()
        })
        .catch(reason => {
          error(reason);
          res.status(500).json({error: "Unable to proccess the request"})
        })
    })
    .catch(reson => next(reason));
});

module.exports = router;
