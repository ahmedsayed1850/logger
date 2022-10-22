// server.js
const { createServer } = require("http");
const { parse } = require("url");

const stream = require("stream");
const next = require("next");

const clientLogger = require("./logger/server-log");
const logger = require("pino-http")({
  logger: clientLogger,
  autoLogging: true,
});

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST_NAME || "localhost";
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const okResponse = (res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("message logged on server");
};

const errorResponse = (res) => {
  res.statusCode = 500;
  res.setHeader("Content-Type", "text/plain");
  res.end("error ocurred when logging on server");
};

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    logger(req, res);
    if (pathname === "/log") {
      req.setEncoding("utf8");
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      stream.finished(req, (err) => {
        if (err) {
          req.log.error(err);
          return errorResponse(res);
        }
        try {
          const { msg, level = "info" } = JSON.parse(data);
          req.log[level](msg);
        } catch (err) {
          return errorResponse(res);
        }
        return okResponse(res);
      });
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, (err) => {
    if (err) throw err;
  });
});
