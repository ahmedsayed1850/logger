const { Schema, model, Types } = require("mongoose");

const logSchema = new Schema({
  level: {
    numberInt: {
      type: "String",
    },
  },
  time: {
    date: {
      numberLong: {
        type: "String",
      },
    },
  },
  pid: {
    numberInt: {
      type: "String",
    },
  },
  hostname: {
    type: "String",
  },
  req: {
    id: {
      numberInt: {
        type: "String",
      },
    },
    method: {
      type: "String",
    },
    url: {
      type: "String",
    },
    headers: {
      host: {
        type: "String",
      },
      connection: {
        type: "String",
      },
      "sec-ch-ua": {
        type: "String",
      },
      "sec-ch-ua-mobile": {
        type: "String",
      },
      "user-agent": {
        type: "String",
      },
      "sec-ch-ua-platform": {
        type: "String",
      },
      accept: {
        type: "String",
      },
      "sec-fetch-site": {
        type: "String",
      },
      "sec-fetch-mode": {
        type: "String",
      },
      "sec-fetch-dest": {
        type: "String",
      },
      referer: {
        type: "String",
      },
      "accept-encoding": {
        type: "String",
      },
      "accept-language": {
        type: "String",
      },
      "if-none-match": {
        type: "String",
      },
      "if-modified-since": {
        type: "String",
      },
    },
    remoteAddress: {
      type: "String",
    },
    remotePort: {
      numberInt: {
        type: "String",
      },
    },
  },
  res: {
    statusCode: {
      numberInt: {
        type: "String",
      },
    },
    headers: {
      "accept-ranges": {
        type: "String",
      },
      "cache-control": {
        type: "String",
      },
      "last-modified": {
        type: "String",
      },
      etag: {
        type: "String",
      },
    },
  },
  responseTime: {
    numberInt: {
      type: "String",
    },
  },
  msg: {
    type: "String",
  },
});

module.exports = model("Log", logSchema);
