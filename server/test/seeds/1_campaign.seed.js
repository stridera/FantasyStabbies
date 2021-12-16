const tableNames = require("../../db/tableNames");
const slugify = require("slugify");
const { createDateTimestamp } = require("../utils");

const createRow = (name, start, public, min_account_age = 30) => {
  return {
    name,
    public,
    slug: slugify(name),
    min_account_age,
    nominate_start_date: createDateTimestamp(start),
    nominate_end_date: createDateTimestamp(start + 1),
    voting_start_date: createDateTimestamp(start + 2),
    voting_end_date: createDateTimestamp(start + 3),
  };
};
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.campaign)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.campaign).insert([
        { id: 10001, ...createRow("Private Before Noms", 1, false) },
        { id: 10002, ...createRow("Private During Noms", 0, false) },
        { id: 10003, ...createRow("Private During Voting", -1, false) },
        { id: 10004, ...createRow("Private After Voting", -2, false) },
        { id: 10005, ...createRow("Public Before Noms", 1, true) },
        { id: 10006, ...createRow("Public During Noms", 0, true) },
        { id: 10007, ...createRow("Public During Voting", -1, true) },
        { id: 10008, ...createRow("Public After Voting", -2, true) },
      ]);
    });
};
