const tableNames = require("../../db/tableNames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.category)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.category).insert([
        { id: 10001, title: "PrivateCategory", description: "Private Category", type: "novel", campaign: 10001 },
        { id: 10002, title: "PublicCategory", description: "Public Category", type: "novel", campaign: 10005 },
        { id: 10003, title: "PublicCategory", description: "Public Category", type: "novel", campaign: 10006 },
        { id: 10004, title: "PublicCategory", description: "Public Category", type: "novel", campaign: 10007 },
        { id: 10005, title: "PublicCategory", description: "Public Category", type: "novel", campaign: 10008 },
      ]);
    });
};
