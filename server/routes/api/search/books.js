const router = require("express").Router();
const CacheService = require("../../../services/caching");
const GoogleBooks = require("../../../services/googlebooks");

const ttl = 60 * 60 * 1 * 24; // cache for 1 Day
const cache = new CacheService(ttl); // Create a new cache service instance

router.get("/search/books/:query", async (req, res, next) => {
  try {
    const query = req.params.query;
    const cache_key = `search_${query}`;
    const results = await cache.get(cache_key, async () => {
      const response = await GoogleBooks.search(query);
      if (response) {
        return response;
      } else {
        throw Error("Error getting search results from Google.");
      }
    });
    res.send(results);
  } catch (err) {
    return next(err);
  }
});

router.get("/search/id/:query", async (req, res, next) => {
  try {
    const query = req.params.query;
    const cache_key = `book_${query}`;
    const results = await cache.get(cache_key, async () => {
      const response = await GoogleBooks.byId(query);
      if (response) {
        return response;
      } else {
        throw Error("Error getting search results from Google.");
      }
    });
    res.send(results);
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
