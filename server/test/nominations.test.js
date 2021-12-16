const request = require("supertest");
const app = require("../app");
const tableNames = require("../db/tableNames");
const authMock = require("./mocks/auth");
const { connectToTestDatabase } = require("./utils");

describe("Get Nomations", () => {
  describe("Get all Nominations", () => {
    it("should return an array of nominations for moderators", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/")
        .set(authMock(true))
        .expect(200);
      expect(nomination[0]).toHaveProperty("votes");
    });
    it("should return an array of nominations for non-moderators", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/")
        .set(authMock(false))
        .expect(200);
      expect(nomination).not.toHaveProperty("votes");
    });
    it("should return a 404 for private campaigns for non-moderator", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10001/category/10001/nominations/")
        .set(authMock(false))
        .expect(404);
    });
  });

  describe("with votes after voting phase", () => {
    it("should return an array of nominations for moderators", async () => {
      const { body: nominations } = await request(app)
        .get("/api/campaigns/10008/category/10005/nominations/")
        .set(authMock(true))
        .expect(200);
      expect(nominations.length).toBe(1);
      expect(parseInt(nominations[0].votes)).toBe(4);
    });
    it("should return an array of nominations for non-moderators", async () => {
      const { body: nominations } = await request(app)
        .get("/api/campaigns/10008/category/10005/nominations/")
        .set(authMock(false))
        .expect(200);
      expect(nominations.length).toBe(1);
      expect(parseInt(nominations[0].votes)).toBe(4);
    });
  });

  describe("Getting a single nomination", () => {
    it("should return a nomination for private campaigns for moderators", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10001/category/10001/nominations/10001")
        .set(authMock(true))
        .expect(200);
    });
    it("should return a nomination for non-moderators", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/10002")
        .set(authMock(false))
        .expect(200);
    });
    it("should return a 404 for private campaigns for non-moderator", async () => {
      const { body: nomination } = await request(app)
        .get("/api/campaigns/10001/category/10001/nominations/10001")
        .set(authMock(false))
        .expect(404);
    });
  });
});

describe("Create new nominations", () => {
  let knex;

  beforeAll(async () => {
    knex = await connectToTestDatabase();
  });
  afterAll(async () => {
    await knex.destroy();
  });

  describe("Before Nomination Phase", () => {
    it("should create a new nomination in private campaigns for moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/")
        .set(authMock(true))
        .send({ work: 10002 })
        .expect(201);
      const expected = await knex(tableNames.nomination).where({ id: nomination.id }).first();
      expect(expected.user).toEqual(10001);
      expect(expected.work).toBe(10002);
    });
    it("should not be able to add duplicate nominations for moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/")
        .set(authMock(true))
        .send({ work: 10001 })

        .expect(409);
      expect(nomination.error).toBe("Nomination already exists.");
    });
    it("should be unable to create new nominations for non-moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/")
        .set(authMock(false))
        .send({ work: 10003 })
        .expect(400);
      expect(nomination.error).toBe("Nomination phase has not started yet.");
    });
  });
  describe("During Nomination Phase", () => {
    it("should return a 404 for private campaigns for non-moderator", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10002/category/10001/nominations/")
        .set(authMock(false))
        .send({ work: 10003 })
        .expect(404);
    });
    it("should create a new nomination in public campaigns for non-moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10006/category/10003/nominations/")
        .set(authMock(false))
        .send({ work: 10003 })
        .expect(201);
      const expected = await knex(tableNames.nomination).where({ id: nomination.id }).first();
      expect(expected.user).toEqual(10001);
      expect(expected.work).toBe(10003);
    });
    it("should not be able to add nominations for non-moderators under min_account_age", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10006/category/10003/nominations/")
        .set(authMock(false, 10003, 1))
        .send({ work: 10004 })
        .expect(400);
      expect(nomination.error).toBe("Your account is too young to participate in this campaign.");
    });
  });
  describe("After Nomination Phase", () => {
    it("should return a 404 for private campaigns for non-moderator", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10003/category/10004/nominations/")
        .set(authMock(false))
        .send({ work: 10003 })
        .expect(404);
    });
    it("should be unable to create new nominations for non-moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10007/category/10004/nominations/")
        .set(authMock(false))
        .send({ work: 10003 })
        .expect(400);
      expect(nomination.error).toBe("Nomination phase has ended.");
    });
    it("should be unable to create new nominations for moderators", async () => {
      const { body: nomination } = await request(app)
        .post("/api/campaigns/10007/category/10004/nominations/")
        .set(authMock(true))
        .send({ work: 10003 })
        .expect(201);
      const expected = await knex(tableNames.nomination).where({ id: nomination.id }).first();
      expect(expected.user).toEqual(10001);
      expect(expected.work).toBe(10003);
    });
  });
});
