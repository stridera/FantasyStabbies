const tableNames = require("../../db/tableNames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.nomination)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.nomination).insert([
        { id: 10001, category_id: 10001, work_id: 10001, user_id: 10001 },
        { id: 10002, category_id: 10002, work_id: 10001, user_id: 10001 },
        { id: 10003, category_id: 10003, work_id: 10001, user_id: 10001 },
        { id: 10004, category_id: 10004, work_id: 10001, user_id: 10001 },
        { id: 10005, category_id: 10005, work_id: 10001, user_id: 10001 },
      ]);
    });
};
