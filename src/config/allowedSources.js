const allowedSources = {
  google_books: { id: "google_books", text: "Google Books", helperText: "Search for books by Title or Author." },
  reddit_user: {
    id: "reddit_user",
    text: "Reddit /u/User URL",
    helperText: "https://www.reddit.com/u/",
    validation: "reddit_user",
    regexp: /^(?:(?:https?):\/\/)?(?:www\.)?(?:reddit\.com)?(?:\/u(?:ser)?\/)?([a-z0-9]+)$/,
  },
  fantasy_url: {
    id: "fantasy_url",
    text: "/r/Fantasy URL",
    helperText: "https://www.reddit.com/r/",
    regexp: /^(?:(?:https?):\/\/)?(?:www\.)?(?:reddit\.com)?(?:\/r\/)?(.+)$/,
    validation: "fantasy_url",
  },
  manual: { id: "manual", text: "Manual Entry" },
};

module.exports = allowedSources;
