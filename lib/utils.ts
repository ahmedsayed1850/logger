import { AssertionError } from "assert";
import { client, v2 } from "@datadog/datadog-api-client";
// const prisma = new PrismaClient();
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// let year = new Date().getFullYear();
// let month = new Date().getMonth();
// let day = new Date().getDay();

// let month: string | number = new Date().getMonth();
// let day: string | number = new Date().getDay();

// if (day <= 9) day = `0${day}`;
// if (month <= 9) month = `0${month}`;

// async function main() {

// }

// const { isTemplateLiteralToken } = require("typescript");

let jsonLog = {
  lambda: [],
  static: [],
  edge: [],
  build: [],
  external: [],
};

let yesterday = new Date();
let today = new Date();
let yesterdayCalc = 24 * 60 * 60 * 1000 * 5; //1 days

yesterday.setTime(yesterday.getTime() - yesterdayCalc);
const isoYesterday = yesterday.toISOString();
const isoToday = today.toISOString();

const getColonTimeFromDate = (date) => date.toTimeString().slice(0, 8);
// -------

// let year = new Date().getFullYear();
// let month = new Date().getMonth();
// let day = new Date().getDay();

// important colon doesn't work so I replaced it with ： it has another code point.
// let builtType;
// const fiilePath = `${builtType}-${year}-${month}-${day}T00：00：00.json`;
const configurationOpts = {
  authMethods: {
    apiKeyAuth: process.env.DD_API_AUTH_KEY,
    appKeyAuth: process.env.DD_APP_AUTH_KEY,
  },
};

const configuration = client.createConfiguration(configurationOpts);
client.setServerVariables(configuration, {
  site: "us5.datadoghq.com",
});
const apiInstance = new v2.LogsApi(configuration);

const params: {
  filterFrom: any;
  filterTo: any;
} = {
  filterFrom: isoYesterday,
  filterTo: isoToday,
};

// `${item}-${year}-${month}-${day}T00：00：00.json`,

// ISO timestamp
// 2022-10-20T19:18:25.210Z

export async function getAndSaveLogsMongoandData() {
  const users = await prisma.loggin.findMany();
  try {
    fs.writeFile(`client.json`, JSON.stringify(users), "utf8", (e) => {
      if (e) {
        console.error(`${e}`);
      }
    });
    for await (const item of apiInstance.listLogsGetWithPagination(params)) {
      switch (item.attributes.attributes.source) {
        case "lambda":
          jsonLog.lambda.push(item);
          break;
        case "static":
          jsonLog.static.push(item);
          break;
        case "edge":
          jsonLog.edge.push(item);
          break;
        case "build":
          jsonLog.build.push(item);
          break;
        case "external":
          jsonLog.external.push(item);
      }
    }
    for (let item in jsonLog) {
      fs.writeFile(
        `${item}.json`,
        JSON.stringify(jsonLog[item]),
        "utf8",
        function (err) {
          if (err) throw err;
        }
      );
    }
  } catch (error) {
    console.error(`${error}`);
  }
}

export const randomString = (length: number) =>
  (Math.random() + 1).toString(36).slice(2, 2 + length);

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message });
  }
}
