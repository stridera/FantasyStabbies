const request = require("supertest");
const app = require("../app");
const moxios = require("moxios");
const authMock = require("./mocks/auth");
const { connectToTestDatabase, createDateTimestamp } = require("./utils");
const tableNames = require("../db/tableNames");

describe("Create New Work", () => {
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

  describe("via Manual Entry", () => {
    const url = "/api/work/manual";

    it("Should create a new work for non-moderator", async () => {
      const { body } = await request(app)
        .post(url)
        .set(authMock(false))
        .send({
          title: "Test",
          authors: "authors",
          source_url: "https://www.test_url.com",
          image_url: "https://www.test_url.com",
          source: "manual",
        })
        .expect(201);

      const work = await knex(tableNames.work).where({ id: body.id }).first();
      expect(work.title).toBe("Test");
      expect(work.source_url).toBe("https://www.test_url.com");
      expect(work.image_url).toBe("https://www.test_url.com");
      expect(work.source).toBe("manual");
    });

    it("Should not create a new work if not logged in", async () => {
      await request(app)
        .post(url)
        .send({
          title: "Test",
          source_url: "https://www.test_url1.com",
          image_url: "https://www.test_url1.com",
          source: "manual",
        })
        .expect(403);
    });
  });

  describe("via Google Books", () => {
    const url = "/api/work/google_books";
    beforeEach(() => {
      moxios.install();
    });
    afterEach(() => {
      moxios.uninstall();
    });

    it("Should return the id of the existing google book work", async () => {
      const { body: work } = await request(app)
        .post(url)
        .set(authMock(false))
        .send({
          google_book_id: "Je7LtAEACAAJ",
          title: "React for Real",
          source: "google_books",
        })
        .expect(201);
      expect(work.id).toBe(10001);
    });

    it("Should create a new work if it doesn't exist", async () => {
      moxios.stubRequest("https://www.googleapis.com/books/v1/volumes/t_ZYYXZq4RgC", {
        status: 200,
        response: {
          id: "t_ZYYXZq4RgC",
          etag: "wzT0UO1j88k",
          volumeInfo: {
            title: "Mistborn",
            authors: ["Brandon Sanderson"],
            publisher: "Macmillan",
            publishedDate: "2010-04-01",
            imageLinks: {
              thumbnail: "http://imglink.com",
            },
            infoLink: "https://infolink.com",
          },
        },
      });
      // Need to mock axios to return a response with a google book id
      const { body: work } = await request(app).post(url).set(authMock(false)).send({
        google_book_id: "t_ZYYXZq4RgC",
        title: "Mistborn",
        source: "google_books",
      });
      expect(work.id).toBe(2);
      expect(work.title).toBe("Mistborn");
      expect(work.authors).toBe("Brandon Sanderson");
      expect(work.publisher).toBe("Macmillan");
      expect(work.published_date).toBe("2010-04-01");
      expect(work.source_url).toBe("https://infolink.com");
      expect(work.image_url).toBe("http://imglink.com");
    });
  });
});
