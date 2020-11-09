const path = require('path');

const PORT = process.env.PORT || 3000;
const cliArgs = {};

const args = process.argv.slice(2);

args.forEach(arg => {
  const [key, value] = arg.split("=");
  cliArgs[key.slice(1)] = value;
});

module.exports = {
  PORT,
  ENV: cliArgs.env || 'dev',
  EVENTSDTOPATH: path.join(__dirname, 'eventsDTO.csv'),
}