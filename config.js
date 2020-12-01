const cliArgs = {};

const args = process.argv.slice(2);

args.forEach(arg => {
  const [key, value] = arg.split("=");
  cliArgs[key.slice(1)] = value;
});

module.exports = {
  PORT: process.env.PORT || 3000,
  ENV: cliArgs.env || 'dev',
  EVENTSDTOPATH: './eventsDTO.csv',
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  MONGO_ROUTE: process.env.MONGO_ROUTE,
}