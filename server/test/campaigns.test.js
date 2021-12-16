const request = require("supertest");
const app = require("../app");
const authMock = require("./mocks/auth");
const { connectToTestDatabase, createDateTimestamp } = require("./utils");
const tableNames = require("../db/tableNames");

const compareCampaign = (campaign, expected) => {
  expect(campaign.id).toBe(expected.id);
  expect(campaign.name).toBe(expected.name);
  expect(campaign.min_account_age).toBe(expected.min_account_age);
  expect(campaign.public).toBe(expected.public);
  expect(campaign.nominate_start_date).toBe(expected.nominate_start_date.toISOString());
  expect(campaign.nominate_end_date).toBe(expected.nominate_end_date.toISOString());
  expect(campaign.voting_start_date).toBe(expected.voting_start_date.toISOString());
  expect(campaign.voting_end_date).toBe(expected.voting_end_date.toISOString());
};

const compareCampaigns = (campaigns, expected) => {
  campaigns.forEach((campaign, i) => {
    compareCampaign(campaign, expected[i]);
  });
};

describe("Get Campaigns", () => {
  let knex;

  beforeAll(async () => {
    knex = await connectToTestDatabase();
    if (!knex) {
      throw new Error("Could not connect to test database");
    }
  });
  afterAll(async () => {
    await knex.destroy();
  });

  describe("Get all campaigns", () => {
    it("should return an array of campaigns for moderators", async () => {
      const { body: campaigns } = await request(app).get("/api/campaigns/").set(authMock(true)).expect(200);
      const expected = await knex.select().from(tableNames.campaign);
      compareCampaigns(campaigns, expected);
    });
    it("should return an array of campaigns for non-moderators", async () => {
      const { body: campaigns } = await request(app).get("/api/campaigns/").set(authMock(false)).expect(200);
      const expected = await knex.select().from(tableNames.campaign).where({ public: true });
      compareCampaigns(campaigns, expected);
    });
  });

  describe("Get a single campaign", () => {
    it("should return a 404 for private campaigns for non-moderator user", async () => {
      await request(app).get(`/api/campaigns/10001`).set(authMock(false)).expect(404);
    });
    it("should return a private campaign for moderators", async () => {
      const { body: campaign } = await request(app).get(`/api/campaigns/10001`).set(authMock(true)).expect(200);
      const expected = await knex.select().from(tableNames.campaign).where({ id: 10001 }).first();
      compareCampaign(campaign, expected);
    });
    it("should return a 403 for unauthenticated user", async () => {
      await request(app).get(`/api/campaigns/10001`).expect(403);
    });
  });
});

describe("Create Campaigns", () => {
  let knex;

  beforeAll(async () => {
    knex = await connectToTestDatabase();
  });
  afterAll(async () => {
    await knex.destroy();
  });

  describe("Unauthorized Users", () => {
    it("should return a 403 for unauthenticated user attempting to create a campaign", async () => {
      const { body: campaign } = await request(app).post("/api/campaigns/").expect(403);
    });
    it("should return a 403 for authenticated user attempting to create a campaign", async () => {
      const { body: campaign } = await request(app).post("/api/campaigns/").set(authMock(false)).expect(403);
    });
  });

  describe("Moderators", () => {
    it("should return a 400 for authenticated moderator attempting to create a campaign with no body", async () => {
      const { body: campaign } = await request(app).post("/api/campaigns/").set(authMock(true)).expect(400);
    });
    it("should return a 400 for authenticated moderator attempting to create a campaign with invalid nomination dates", async () => {
      const { body: campaign } = await request(app)
        .post("/api/campaigns/")
        .send({
          name: "Test Campaign",
          slug: "test-campaign",
          min_account_age: "1",
          public: "true",
          nominate_start_date: createDateTimestamp(2),
          nominate_end_date: createDateTimestamp(1),
          voting_start_date: createDateTimestamp(3),
          voting_end_date: createDateTimestamp(4),
        })
        .set(authMock(true))
        .expect(400);
      expect(campaign.error).toBe("Nomination end must be after it starts.");
    });
    it("should return a 400 for authenticated moderator attempting to create a campaign with invalid voting dates", async () => {
      const { body: campaign } = await request(app)
        .post("/api/campaigns/")
        .send({
          name: "Test Campaign",
          slug: "test-campaign",
          min_account_age: "1",
          public: "true",
          nominate_start_date: createDateTimestamp(1),
          nominate_end_date: createDateTimestamp(2),
          voting_start_date: createDateTimestamp(4),
          voting_end_date: createDateTimestamp(3),
        })
        .set(authMock(true))
        .expect(400);
    });
    it("should return a 201 for authenticated moderator attempting to create a campaign with valid dates", async () => {
      const { body: campaign } = await request(app)
        .post("/api/campaigns/")
        .send({
          name: "Test Post Campaign",
          slug: "test-post-campaign",
          min_account_age: "1",
          public: "true",
          nominate_start_date: createDateTimestamp(1),
          nominate_end_date: createDateTimestamp(2),
          voting_start_date: createDateTimestamp(3),
          voting_end_date: createDateTimestamp(4),
        })
        .set(authMock(true))
        .expect(201);

      const campaign_from_db = await knex(tableNames.campaign).where({ id: campaign.id }).first();
      compareCampaign(campaign, campaign_from_db);
    });
  });
});
