const request = require("supertest");
const app = require("../app");
const tableNames = require("../db/tableNames");
const authMock = require("./mocks/auth");
const { connectToTestDatabase } = require("./utils");

describe("Get Votes", () => {
  describe("As Moderator", () => {
    it("Should return all votes with user details", async () => {
      const { body: votes } = await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/10002/vote/show")
        .set(authMock(true))
        .expect(200);
      expect(votes[0].username).toBe("user1");
      expect(votes[1].username).toBe("user2");
    });
  });
  describe("As User", () => {
    it("Should return current vote", async () => {
      const { body: vote } = await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/10002/vote")
        .set(authMock(false, 10005))
        .expect(200);
      expect(vote.voted).toBe(true);
    });
    it("Should be able to delete thier own vote", async () => {
      const { body: vote } = await request(app)
        .get("/api/campaigns/10007/category/10004/nominations/10004/vote")
        .set(authMock(false, 10006))
        .expect(200);
      expect(vote.voted).toBe(true);
    });
    it("Should not return all votes with user details", async () => {
      await request(app)
        .get("/api/campaigns/10005/category/10002/nominations/10002/vote/show")
        .set(authMock(false))
        .expect(403);
    });
  });
});

describe("Cast Votes", () => {
  describe("As Moderator", () => {
    it("Should cast vote", async () => {
      const { body: votes } = await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/10002/vote")
        .set(authMock(true))
        .expect(200);
      expect(votes.success).toBe(true);
    });
    it("Should not cast vote if already voted", async () => {
      await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/10002/vote")
        .set(authMock(true))
        .expect(409);
    });
    it("Should not cast vote if account too new", async () => {
      const { body: msg } = await request(app)
        .post("/api/campaigns/10005/category/10002/nominations/10002/vote")
        .set(authMock(false, 10003, 1))
        .expect(400);
      expect(msg.error).toBe("Your account is too young to participate in this campaign.");
    });
  });
});

// describe("Change Votes", () => {
//   it("Should change own vote", async () => {
//     const { body: votes } = await request(app)
//       .patch("/api/campaigns/10005/category/10002/nominations/10002/vote")
//       .set(authMock(false, 10005))
//       .expect(200);
//     expect(votes).toBe(true);
//   });
// });

describe("Delete Votes", () => {
  describe("As User", () => {
    it("Should be able to delete thier own vote", async () => {
      const { body: response } = await request(app)
        .delete("/api/campaigns/10007/category/10004/nominations/10004/vote")
        .set(authMock(false, 10006));
      // .expect(200);
      expect(response.success).toBe(true);
    });
  });
});
