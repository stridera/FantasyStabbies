const request = require("supertest");
const app = require("../app");
const authMock = require("./mocks/auth");
const { connectToTestDatabase } = require("./utils");
const tableNames = require("../db/tableNames");

describe("Get Categories", () => {
  let knex;

  beforeAll(async () => {
    knex = await connectToTestDatabase();
  });
  afterAll(async () => {
    await knex.destroy();
  });

  describe("Unauthenticated users", () => {
    it("should not be able to get campaigns for private categories", async () => {
      const response = await request(app).get(`/api/campaigns/10001/category`).expect(403);
    });
    it("should not be able to get campaigns for public categories", async () => {
      const response = await request(app).get(`/api/campaigns/10005/category`).expect(403);
    });
  });

  describe("Users", () => {
    it("should not be able to get campaigns for private categories", async () => {
      await request(app).get(`/api/campaigns/10001/category`).set(authMock(false)).expect(404);
    });
    it("should be able to get campaigns for public categories", async () => {
      const { body: categories } = await request(app)
        .get(`/api/campaigns/10005/category`)
        .set(authMock(false))
        .expect(200);
      expect(categories.campaign).toBe(10005);
      expect(categories.categories.length).toBe(1);
    });
  });

  describe("Moderators", () => {
    it("should return all categories for a campaign", async () => {
      const { body: categories } = await request(app)
        .get(`/api/campaigns/10001/category`)
        .set(authMock(true))
        .expect(200);
      expect(categories.campaign).toBe(10001);
      expect(categories.categories.length).toBe(1);
    });

    it("should return a 404 if the campaign does not exist", async () => {
      await request(app).get(`/api/campaigns/9999/category`).set(authMock(true)).expect(404);
    });
  });
});

describe("Create Categories", () => {
  let knex;

  beforeAll(async () => {
    knex = await connectToTestDatabase();
  });
  afterAll(async () => {
    await knex.destroy();
  });

  describe("Unauthorized users", () => {
    it("should not be able to create a category", async () => {
      const { body: category } = await request(app)
        .post(`/api/campaigns/10005/category`)
        .set(authMock(false))
        .send({
          title: "Test Category",
          type: "novel",
        })
        .expect(403);
    });
  });

  describe("Authorized users", () => {
    it("should be able to create a category", async () => {
      const { body: category } = await request(app)
        .post(`/api/campaigns/10005/category`)
        .set(authMock(true))
        .send({
          title: "Category Creation Test",
          source: "novel",
        })
        .expect(201);
      expect(category.campaign).toBe(10005);
      expect(category.category.id).toBe(1);
    });

    it("should not be able to create a category with a duplicate title", async () => {
      const { body: category } = await request(app)
        .post(`/api/campaigns/10005/category`)
        .set(authMock(true))
        .send({
          title: "Category Creation Test",
          source: "novel",
        })
        .expect(409);
      expect(category.error).toBe("Category already exists.");
    });

    // it("should not be able to create a category with an invalid type", async () => {
    //   const { body: category } = await request(app).post(`/api/campaigns/10005/category`).set(authMock(true)).send({
    //     title: "Category Creation Test 4",
    //     type: "invalid",
    //   });
    //   // .expect(400);
    //   expect(category).toBe("Category type must be one of: novel, fanfic, or game");
    // });
  });
});
