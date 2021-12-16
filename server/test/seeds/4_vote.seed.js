const tableNames = require("../../db/tableNames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.vote)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.vote).insert([
        { id: 10001, nomination: 10002, user: 10005, ip_address: "127.0.0.1" },
        { id: 10002, nomination: 10002, user: 10006, ip_address: "127.0.0.1" },
        { id: 10003, nomination: 10005, user: 10006, ip_address: "127.0.0.1" },
        { id: 10004, nomination: 10005, user: 10007, ip_address: "127.0.0.1" },
        { id: 10005, nomination: 10005, user: 10008, ip_address: "127.0.0.1" },
        { id: 10006, nomination: 10005, user: 10009, ip_address: "127.0.0.1" },
      ]);
    });
};
