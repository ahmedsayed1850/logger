import { NextApiRequest, NextApiResponse } from "next";
import AWS from "aws-sdk";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { getAndSaveLogsMongoandData } from "../../lib/utils";
const mongoose = require("mongoose");

let prisma = new PrismaClient();
let promises = [
  "build.json",
  "lambda.json",
  "external.json",
  "edge.json",
  "static.json",
  "client.json",
].map(function (_path) {
  return new Promise(
    function (_path, resolve, reject) {
      fs.readFile(_path, "utf8", function (err, data) {
        if (err) {
          console.error(`${err}`);
          resolve("");
        } else {
          resolve(data);
        }
      });
    }.bind(this, _path)
  );
});

const buildName = ["build", "lambda", "external", "edge", "static", "client"];

let today = new Date().toISOString().slice(0, 10).split("-");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const id = mongoose.Types.ObjectId().getTimestamp();
      getAndSaveLogsMongoandData()
        .then(async () => {})
        .catch(async (e) => {
          console.error(e);
          await prisma.$disconnect();
          process.exit(1);
        });
      await prisma.$disconnect();
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_KEY,
      });
      res.status(200).send("Sucessfully Uploaded");
      setTimeout(() => {
        Promise.all(promises).then(function (results) {
          results.forEach(function (content, idx) {
            console.log(content, "content");
            const params = {
              Bucket: "drainlog",
              Key: `${buildName[idx]}-${today[0]}-${today[1]}-${today[2]}T00:00:00.txt`,
              Body: content,
            };

            s3.upload(params, (err, data) => {
              if (err) {
                console.error(`${err}`);
              }
            });
          });
        });
      }, 900000);
      setTimeout(() => {
        [
          "build.json",
          "lambda.json",
          "external.json",
          "edge.json",
          "static.json",
          "client.json",
        ].map((_path) => {
          fs.unlink(_path, (err) => {
            if (err) throw err;
          });
        });
        prisma.loggin.deleteMany({
          where: {
            time: {
              lte: id,
            },
          },
        });
      }, 1800000);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
