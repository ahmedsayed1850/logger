const pino = require("pino");
const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};
const transport = pino.transport({
  target: "pino-mongodb",
  level: "info",
  options: {
    uri: process.env.DATABASE_URL,
    database: "loggin",
    collection: "loggin",
  },
});

module.exports = pino(transport);
