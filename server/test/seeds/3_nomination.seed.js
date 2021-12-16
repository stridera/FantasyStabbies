const tableNames = require("../../db/tableNames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.nomination)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.nomination).insert([
        { id: 10001, category: 10001, work: 10001, user: 10001 },
        { id: 10002, category: 10002, work: 10001, user: 10001 },
        { id: 10003, category: 10003, work: 10001, user: 10001 },
        { id: 10004, category: 10004, work: 10001, user: 10001 },
        { id: 10005, category: 10005, work: 10001, user: 10001 },
      ]);
    });
};
