const axios = require("axios");
const CacheService = require("./caching");

const ttl = 60 * 60 * 1; // cache for 1 Hour
const cache = new CacheService(ttl); // Create a new cache service instance

// Reddit changed their settings to require you to be logged in to view the list of mods.
// So in order to use this, I would have to use praw.  For the time being, I'll just
// use a hardcoded list.  Ensure you have MODS set as an environment variable.
// const isMod = async (username) => {
//   try {
//     const mods = await cache.get("reddit_mods", async () => {
//       const response = await axios.get(
//         "https://www.reddit.com/r/fantasy/about/moderators.json"
//       );

//       if (response) {
//         return response.data.data.children.map((val) => {
//           return val.name;
//         });
//       } else {
//         throw Error("Unable to get current mods from Reddit.");
//       }
//     });

//     return mods.includes(username);
//   } catch (err) {
//     console.log("isMod error:", err);
//     return false;
//   }
// };
const mods = process.env.MODS.split(",");

if (mods.length === 0) console.log("No mods defined for the env!  You won't be able to control the site.");

const isMod = (username) => {
  return mods.includes(username);
};
module.exports = isMod;
