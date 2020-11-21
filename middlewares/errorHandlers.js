const logger = require('./../logger.js');

function error404(req, res, next) {
  logger.error({
    error: "Wrong URL request",
    url: req.url
  });
  res.status(404).json({error: "Not found"})
}

function error500(err, req, res, next) {
  if (!err) next();
  logger.error(err);
  res.status(500).json({error: "Something went wrong"});
}

module.exports = { error404, error500};