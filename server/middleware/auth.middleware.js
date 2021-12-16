const addDevUser = (req) => {
  if (["dev", "test"].includes(process.env.ENV) && req.headers.authorization == `Bearer ${process.env.DEV_TOKEN}`) {
    if (!req.user) {
      req.user = {
        username: "dev_user",
        id: parseInt(req.headers["x-user-id"]) || 10001,
        reddit_id: "4aulo",
        is_moderator: req.headers["x-is-moderator"] === "true",
        reddit_created: req.headers["x-reddit-created"] || "2020-08-11T16:30:38.564Z",
        loading: false,
        error: null,
      };
    }
  }
};

const ensureAuthenticated = (req, res, next) => {
  addDevUser(req);

  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};

const ensureModerator = (req, res, next) => {
  addDevUser(req);

  if (req.isAuthenticated() && req.user && req.user.is_moderator) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};

const ensureAccountOldEnough = (req, res, next) => {
  const user = req.user;
  const campaign = req.campaign;
  if (user && campaign) {
    if (user.is_moderator) return next();
    if (campaign.min_account_age > 0) {
      // Get age of user in days
      const reddit_created = new Date(user.reddit_created);
      const age = Math.floor((Date.now() - reddit_created) / (1000 * 60 * 60 * 24));
      if (age < campaign.min_account_age)
        return res.status(400).json({ error: "Your account is too young to participate in this campaign." });
    }
    return next();
  }
  return res.sendStatus(403);
};

module.exports = { addDevUser, ensureAuthenticated, ensureModerator, ensureAccountOldEnough };
