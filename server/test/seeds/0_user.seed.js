const tableNames = require("../../db/tableNames");
const { createDateTimestamp } = require("../utils");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.user)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.user).insert([
        {
          id: 10001,
          reddit_id: "moderator",
          username: "moderator",
          is_moderator: true,
          reddit_created: createDateTimestamp(-10),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10002,
          reddit_id: "abcdefg",
          username: "testuser",
          is_moderator: false,
          reddit_created: createDateTimestamp(-400),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10003,
          reddit_id: "newuser",
          username: "newuser",
          is_moderator: false,
          reddit_created: createDateTimestamp(-10),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10004,
          reddit_id: "banned",
          username: "banned",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: true,
          banned_by: 10001,
        },
        {
          id: 10005,
          reddit_id: "user1",
          username: "user1",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10006,
          reddit_id: "user2",
          username: "user2",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10007,
          reddit_id: "user3",
          username: "user3",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10008,
          reddit_id: "user4",
          username: "user4",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: false,
          banned_by: null,
        },
        {
          id: 10009,
          reddit_id: "user5",
          username: "user5",
          is_moderator: false,
          reddit_created: createDateTimestamp(-100),
          is_banned: false,
          banned_by: null,
        },
      ]);
    });
};
