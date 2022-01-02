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
          google_book_id: "Je7LtAEACAAJ",
          title: "React for Real",
          authors: "React for Real",
          source_url: "http://books.google.com/books?id=Je7LtAEACAAJ&dq=react+programming&hl=&source=gbs_api",
          image_url:
            "http://books.google.com/books/content?id=Je7LtAEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
          source: "google_books",
          published_date: "2017-09-16",
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
          image_url: "https://www.test2.com",
          note: "Test Note",
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
          image_url: "https://www.test3.com",
          note: "Test Note",
        },
      ]);
    });
};
