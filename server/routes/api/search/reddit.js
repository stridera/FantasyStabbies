const router = require("express").Router();
const CacheService = require("../../../services/caching");
const Reddit = require("../../../services/reddit");

const ttl = 60 * 60 * 1 * 24; // cache for 1 Day
const cache = new CacheService(ttl); // Create a new cache service instance

router.get("/user/:query", async (req, res, next) => {
  try {
    const query = req.params.query;
    const cache_key = `reddituser_${query}`;
    const results = await cache.get(cache_key, async () => {
      const response = await Reddit.search(query);
      if (response) {
        return response;
      } else {
        throw Error("Error getting search results from Reddit.");
      }
    });
    res.send(results);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
