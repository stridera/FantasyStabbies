const axios = require("axios");
const CacheService = require("../services/caching");

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance

const isMod = async (username) => {
  try {
    const mods = await cache.get("reddit_mods", async () => {
      const response = await axios.get("https://www.reddit.com/r/fantasy/about/moderators.json");

      if (response) {
        return response.data.data.children.map((val) => {
          return val.name;
        });
      } else {
        throw Error("Unable to get current mods from Reddit.");
      }
    });

    return mods.includes(username);
  } catch (err) {
    console.log("isMod error:", err);
    return [];
  }
};

module.exports = isMod;
