const axios = require("axios");
const { response } = require("express");
const api_url = "https://www.googleapis.com/books/v1/volumes";

const filterBook = (book) => {
  return {
    google_book_id: book.id,
    title: book.volumeInfo.title,
    authors: book.volumeInfo.authors.join(", "),
    publisher: book.volumeInfo.publisher,
    published_date: book.volumeInfo.publishedDate,
    description: book.volumeInfo.description,
    image_url: book.volumeInfo.imageLinks.thumbnail,
    source_url: book.volumeInfo.infoLink,
    source: "google",
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

// https://www.googleapis.com/books/v1/volumes/volumeId
const byId = async (id) => {
  const response = await axios.get(`${api_url}/${id}`);
  return filterBook(response.data);
};

module.exports = { search, byId };
