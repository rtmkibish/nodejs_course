const http = require('http');
const Storage = require('./storage');

const storage = new Storage();

const paramsRegexp = /:[^/]+/g;
const getRouteRegexp = route => new RegExp(`^${route}$`.replace(paramsRegexp, '([^/]+)'));

function getRouteParams(matchedRoute, path) {
  const paramNames = (matchedRoute.match(paramsRegexp) || []).map(item => item.substring(1));
  return paramNames.length ? path.match(getRouteRegexp(matchedRoute))
  .slice(1)
  .reduce((res, val, idx) => (Object.assign(res, {[paramNames[idx]]: val})), {}) : {};
}

const router = {
  GET: new Map([
    ['/events', (req, res) => {
      setJSONHeader(res);
      storage.findEvents({})
        .then(events => {
          res.end(JSON.stringify(events))
        })
        .catch(reason => {
          console.error(reason);
          res.statusCode = 500;
          res.end(JSON.stringify({error: "Intenal server error"}));
        });
    }],
    ['/events/:id', (req, res) => {
      setJSONHeader(res);
      const eventId = req.routeParams.id;
      storage.getEvent(eventId)
        .then(event => {
          if (event) {
            res.end(JSON.stringify(event));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({error: "Event is not found"}))
          }
        })
        .catch(reason => {
          console.error(reason);
          res.statusCode = 500;
          res.end(JSON.stringify({error: "Intenal server error"}));
        })
    }]
  ]),
  POST: new Map([
    ['/events', (req, res) => {
      req.body
        .then(rawEvent => {
          const fields = ['title', 'location', 'date', 'hour'];
          const rawEventKeys = Object.keys(rawEvent);
          const requiredFields = fields.filter(f => rawEventKeys.includes(f));
          const requiredKeysNumber = 4;
        
          if (requiredFields.length < requiredKeysNumber) {
            res.statusCode = 400
            res.end(JSON.stringify({message: "One or more required fields are missed"}));
          }
        
          requiredFields.unshift('id');
          const eventObj = requiredFields.reduce((acc, f) => {
            acc[f] = rawEvent[f] || '';
            return acc;
          }, {});
        
          storage.addEvent(eventObj)
            .then(event => res.end(JSON.stringify(event)))
            .catch(reason => {
              console.error(reason);
              res.statusCode = 500;
              res.end(JSON.stringify({error: "Unable to proccess the request"}));
            })
        })
        .catch(reason => console.error(reason));
    }]
  ]),
  DELETE: new Map([
    ['/events/:id', (req, res) => {
      const eventId = req.routeParams.id;
      storage.getEvent(eventId)
        .then(event => {
          if (!event) {
            setJSONHeader(res);
            res.statusCode = 404;
            res.end(JSON.stringify({error: "Event is not found"}));
          }
          storage.deleteEvent(event.id)
            .then(() => {
              res.statusCode = 204
              res.end()
            })
            .catch(reason => {
              console.error(reason);
              setJSONHeader(res);
              res.statusCode = 500;
              res.end(JSON.stringify({error: "Unable to proccess the request"}));
            })
        })
    }]
  ])
}

function setJSONHeader(res) {
  res.setHeader('Content-Type', 'application/json');
}

function constructJSONBody(req) {
  req.body = new Promise((resolve, reject) => {
    let bodyData = Buffer.from([]);
    req.on('data', data => {
      bodyData = Buffer.concat([bodyData, data]);
    })
    req.on('end', () => {
      const stringData = bodyData.toString()
      if (stringData.length != 0) {
        resolve(JSON.parse(stringData))
      } else resolve();
    })
    req.on('error', (error) => reject(error));
  })
}

http.createServer((req, res) => {
  const requestMethod = req.method.toUpperCase();
  if (requestMethod == 'POST') {
    constructJSONBody(req);
  }
  try {
    const [ path, queryParams ] = req.url.split('?');
    const availableRoutes = router[requestMethod];
    const matchedRoute = [...availableRoutes.keys()].find(route => {
      return getRouteRegexp(route).test(path);
    });
    const routeParams = getRouteParams(matchedRoute, path);
    Object.assign(req, {queryParams, routeParams});

    availableRoutes.get(matchedRoute)(req, res);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({error: "Intenal server error"}));
  }
}).listen(8080, () => console.log('Started on port: 8080'))