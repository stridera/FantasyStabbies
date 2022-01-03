const axios = require("axios");
const approvedSources = require("../../src/config/allowedSources");

const filterResults = (book) => {
  return {
    google_book_id: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors.join(", "),
    publisher: book.volumeInfo.publisher,
    published_date: book.volumeInfo.publishedDate,
    image_url: book.volumeInfo.imageLinks.thumbnail,
    source_url: book.volumeInfo.infoLink,
    source: approvedSources.google_books.id,
  };
};
const search = async (query) => {
  const response = await axios.get(api_url, { params: { q: query } });
  var books = [];
  response.data.items.forEach((book) => {
    books.push(filterBook(book));
  });
  return books;
};
