const http = require('http');
const { PORT, ENV } = require('./config');
const logger = require('./logger');

http.createServer((req, res) => {
  logger.log("Hello, World");
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello, World\n", () => logger.log(`Response is sent at: ${(new Date).toISOString()}`))
}).listen(PORT, () => console.log(`Listening on port: ${PORT}, works in ${ENV} mode.`));