const request = require("supertest");
const app = require("../app");

describe("Search for Reddit User", () => {
  xit("Should provide information by /u/ link", async () => {
    const { body: response } = await request(app).get("/api/search/reddit_user/u/stridera").expect(200);
    expect(response.username).toBe("test");
    expect(response.url).toBe("https://www.reddit.com/user/test");
  });
});
