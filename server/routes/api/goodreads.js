const router = require("express").Router();
const axios = require("axios");
const { transform } = require("camaro");
const CacheService = require("../../services/caching");

const ttl = 60 * 60 * 1 * 24; // cache for 1 Day
const cache = new CacheService(ttl); // Create a new cache service instance

const key = process.env.GOODREADS_KEY;
const goodreads_url = "https://www.goodreads.com";
const searchTemplate = [
  "GoodreadsResponse/search/results/work",
  {
    id: "number(best_book/id)",
    title: "best_book/title",
    author: "best_book/author/name",
    publication_year: "number(original_publication_year)",
    image: "best_book/small_image_url",
    url: "",
  },
];

const bookTemplate = [
  "GoodreadsResponse/book",
  {
    id: "number(id)",
    title: "title",
    author: "authors/author/name",
    publication_year: "number(publication_year)",
    image: "small_image_url",
    url: "url",
  },
];

router.get("/search/:query", async (req, res, next) => {
  try {
    const query = req.params.query;
    const cache_key = `search_${query}`;
    const results = await cache.get(cache_key, async () => {
      const searchURL = `${goodreads_url}/search.xml?key=${key}&q=${query}`;
      const xml = await axios.get(searchURL);
      if (xml) {
        return await transform(xml.data, searchTemplate);
      } else {
        throw Error("Error getting search results from Goodreads.");
      }
    });
    res.send(results);
  } catch (err) {
    return next(err);
  }
});

// https://www.goodreads.com/book/show/31213728.xml?key=Kc9BOCpkBHP3NSfqw4gkqA
router.get("/id/:query", async (req, res, next) => {
  try {
    const query = req.params.query;
    const cache_key = `book_${query}`;
    const results = await cache.get(cache_key, async () => {
      const searchURL = `${goodreads_url}//book/show/${query}.xml?key=${key}`;
      const xml = await axios.get(searchURL);
      if (xml) {
        return await transform(xml.data, bookTemplate);
      } else {
        throw Error("Error getting search results from Goodreads.");
      }
    });
    res.send(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
