const allowedSources = {
  google_books: { id: "google_books", text: "Google Books", helperText: "Search for books by Title." },
  reddit_user: {
    id: "reddit_user",
    text: "Reddit /u/User URL",
    helperText: "Reddit Username",
    url: "https://www.reddit.com/user/",
    regexp: /^(?:(?:https?):\/\/)?(?:www\.)?(?:reddit\.com)?(?:\/u(?:ser)?\/)?([a-z0-9]+)$/,
  },
  fantasy_url: {
    id: "fantasy_url",
    text: "/r/Fantasy URL",
    helperText: "https://www.reddit.com/r/ URL",
    url: "https://www.reddit.com/r/Fantasy",
    regexp: /^(?:(?:https?):\/\/)?(?:www\.)?(?:reddit\.com)?(?:\/r\/)?(.+)$/,
  },
  manual: { id: "manual", text: "Manual Entry" },
};

module.exports = allowedSources;
