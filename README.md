<h1 align="center">🕵️‍♂️ Custom Drain Logger</h1>
<p align="center">
</p>
<div>
  <p>🔎 <strong>About: </strong>See log from anywhere in your app</p>
</div>

<div>
  <h2>⚔️ Info</h2>
  <p>Users should be able to see or perform:</p>

  - [x] Logging drain with pino logger from client to server
  - [x] Added Cron Jobs
  - [x] Upload files to AWS S3
  - [x] Multiple File Stream To Mongodb
  - [x] Added database in-memory-tests
  - [x] Configure Customer Drain
  - [x] Using latest technologies Typescript, Nextjs, Prisma
  - [x] Sending Logs via sendBeacon
  - [x] Saving server production Logs and send it to S3 to store it then delete it.
  - [x] Custom Date for each source vercel [static, lambda, edge, build, external, client]
  - [x] Custom Variable for each Credintial AWS, MongoDB
</div>


## API
Saving off server production logs is important for debugging, app performance, and business analytics.  For apps hosted on Vercel, their advice seems to be to create a log drain via an integration into a paid partner.  These partners seem focused on the debugging and app performance use cases, but seem to miss out on the business analytics use cases.  We need to move these to AWS S3.  Also, we need to handle the logs from both the client and the server.


###  RUN Server
This build is for local mode not for production mode to change for producton use process.env.[VARIABL_NAME]

``` // to start development
npm run dev
// to test in-memory-database
npm run test
```

## ENV Variables
```
// Note that if you want to customize
DATABASE_URL=""
S3_KEY_ID=
S3_ACCESS_KEY=
DD_API_AUTH_KEY=""
DD_APP_AUTH_KEY=""
CLIENT_ID=""
CLIENT_SECRET=""
REDIRECT_HOST=""
API_SECRET_KEY="" // FOR Cron jobs
DATA_DAYS="" // will pull data by day range EX: "5" will pull data from logger by 5 days only
```

## Logging Client with Pino Logger and send data to MongoDB
Below will log the data and log it in your end 
``` 
// server.js
const logger = require("pino-http")({
  logger: clientLogger,
  autoLogging: true,
});

// server-log.js
You can customize priority by levels
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
//it will automatically send it to the database in which collection you have specified
Note that the url should look like that mongodb+srv://*********username:********password@cluster.yq2blzy.mongodb.net/**name-of-collection**?retryWrites=true&w=majority at it will send both client and server logs

```
## Configuration

```
// configure.tsx very simple configuration require teamId and accessToken from vercel to configure your own drain and also you will see other integrations example: datadog or axiom for logging
// team log key example team_********************* 
// log drain example #ld_************** https://http-intake.logs.us5.datadoghq.com/v1/input/secret_key?ddsource=vercel  
// to edit type
const NewDrain: React.FC<NewDrainProps> = ({
  ...
  const [params, setParams] = useState<DrainParams>({
    ...
    type: "ndjson",
    ...
// callback.tsx will to setup the integration and log Data http://example.com/callback

```
## CRON API

```
// will take file which compiled by utils.ts and push it to S3 then delete it from Mongodb
const buildName = ["build", "lambda", "external", "edge", "static", "client"];
let promises = [
  "build.json",
  "lambda.json",
  "external.json",
  "edge.json",
  "static.json",
  "client.json"]
// if you want to delete or add to suite your case
```

## utils and vercel
Function utilitiez and vercel drain sources and there are dates format provided to help you.
utils.ts will push each source of a file and save the file to then consumed by cron API

## tests
this project have been tested with in-memory-test with fake data to make sure everything working correctly
```
//  database/fixtures/index.js
exports.fakeLogData = {
  ...
    res: {
    statusCode: {
      numberInt: "304",
    },
    headers: {
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=0",
      "last-modified": "Tue, 18 Oct 2022 15:54:06 GMT",
      etag: 'W/"654b-183ebcd557f"',
    },
  },
  responseTime: {
    numberInt: "5",
  },
  msg: "request completed",
}
// database/models/data.model.js 
// Note: do not  add _id it will be added by default
// you can change  type of database but make sure to change fixtures
// const {
  validateNotEmpty,
  validateStringEquality,
  validateObjectEquality,
} = require("../../../utils/test-utils/validator.utils");
you can add custom functions depends on your needs
```
## cron workflow
```
name: daily-cron
on:
  schedule:
    - cron: "1 * 1 * *"
jobs:
  cron:
    runs-on: ubuntu-latest
    steps:
      - name: Call API route to migrate data from MongoDB to S3
        run: |
          curl --request POST \
          --url 'https://yoursite.com/api/cron' \
          --header 'Authorization: Bearer ${{ secrets.API_SECRET_KEY }}'

# ┌────────── minute (0 - 59)
# │ ┌────────── hour (0 - 23)
# │ │ ┌────────── day of the month (1 - 31)
# │ │ │ ┌────────── month (1 - 12)
# │ │ │ │ ┌────────── day of the week (0 - 6)
# │ │ │ │ │
# │ │ │ │ │
# │ │ │ │ │
# * * * * *

```

## Preview
![](https://s1.gifyu.com/images/Image-1de9c0a23451652f0.png)
![](https://s1.gifyu.com/images/data-dog-logger.jpg)
![](https://s1.gifyu.com/images/goo.jpg)
![](https://s4.gifyu.com/images/mongodb-example.jpg)
![](https://s4.gifyu.com/images/s3-logger.jpg)


