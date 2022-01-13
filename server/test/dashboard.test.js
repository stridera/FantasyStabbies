const request = require("supertest");
const app = require("../app");
const authMock = require("./mocks/auth");
const { connectToTestDatabase, createDateTimestamp } = require("./utils");
const tableNames = require("../db/tableNames");

describe("Dashboard", () => {
  it("should return basic statistics for all campaigns for the moderator", async () => {
    const { body } = await request(app).get("/api/dashboard/").set(authMock(true)); //.expect(200);
    console.log(body);
  });
});
