const tableNames = require("../../db/tableNames");

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableNames.work)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableNames.work).insert([
        {
          id: 10001,
          google_book_id: "abcd",
          title: "Novel",
          authors: "Author",
          publisher: "Publisher",
          published_date: "2020-01-01",
          source: "google",
          source_url: "https://www.google.com",
          image_url: "https://www.google.com",
          note: "Note",
          is_valid: true,
          approved_by: null,
        },
        {
          id: 10002,
          google_book_id: null,
          title: "Reddit Link",
          authors: "Redditor",
          publisher: "",
          published_date: "2020-01-01",
          source: "reddit",
          source_url: "https://www.reddit.com",
          image_url: "https://www.reddit.com",
          note: "Reddit Note",
          is_valid: true,
          approved_by: null,
        },
        {
          id: 10003,
          google_book_id: null,
          title: "Standard URL",
          authors: "Author",
          publisher: "",
          published_date: "2020-01-01",
          source: "url",
          source_url: "https://www.test.com",
          image_url: "https://www.test.com",
          note: "Test Note",
          is_valid: true,
          approved_by: null,
        },
        {
          id: 10004,
          google_book_id: null,
          title: "Standard URL",
          authors: "Author",
          publisher: "",
          published_date: "2020-01-01",
          source: "url",
          source_url: "https://www.test2.com",
          image_url: "https://www.test.com",
          note: "Test Note",
          is_valid: true,
          approved_by: null,
        },
        {
          id: 10005,
          google_book_id: null,
          title: "Standard URL",
          authors: "Author",
          publisher: "",
          published_date: "2020-01-01",
          source: "url",
          source_url: "https://www.test3.com",
          image_url: "https://www.test.com",
          note: "Test Note",
          is_valid: true,
          approved_by: null,
        },
      ]);
    });
};
