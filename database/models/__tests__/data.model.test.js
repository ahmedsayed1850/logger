const Log = require("../log.model");
const { fakeLogData } = require("../../fixtures");
const {
  validateNotEmpty,
  validateStringEquality,
  validateObjectEquality,
} = require("../../../utils/test-utils/validator.utils");
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
let validData;

let daya;
describe("Client Log Model Test Suite", () => {
  let con;
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    con = await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    con;
    Log.init();
    validData = await Log.create(fakeLogData);
    validData
      .save()
      .then((data) => {
        daya = data;
      })
      .catch((e) => console.error(`${e}`));
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test("should validate Course successfully saved", async () => {
    console.log(daya);

    const { level, time, pid, hostname, req, res, responseTime, msg } =
      validData;

    validateStringEquality(level.numberInt, fakeLogData.level.numberInt);
    validateStringEquality(
      time.date.numberLong,
      fakeLogData.time.date.numberLong
    );
    validateStringEquality(pid.numberInt, fakeLogData.pid.numberInt);
    validateStringEquality(msg, fakeLogData.msg);
    validateStringEquality(hostname, fakeLogData.hostname);
    validateObjectEquality(req, fakeLogData.req);
    validateObjectEquality(res, fakeLogData.res);
    validateStringEquality(
      responseTime.numberInt,
      fakeLogData.responseTime.numberInt
    );
  });
});
