const User = require("../models/user.model");

const addDevUser = async (req) => {
  if (req.user) return;
  if (["dev", "test"].includes(process.env.ENV) && req.headers.authorization == `Bearer ${process.env.DEV_TOKEN}`) {
    const is_moderator = req.headers["x-is-moderator"] == "true";
    const reddit_id = `dev_${is_moderator ? "moderator" : "user"}`;
    const data = {
      id: parseInt(req.headers["x-user-id"]) || 10001,
      username: reddit_id,
      reddit_id: reddit_id,
      is_moderator: is_moderator,
      reddit_created: req.headers["x-reddit-created"] || "2020-08-11T16:30:38.564Z",
    };

    if (process.env.ENV == "dev") {
      req.user = await User.query().where("reddit_id", reddit_id).first();
      if (!req.user) {
        req.user = await User.query().insert(data);
      }
    } else {
      // Test Env
      req.user = data;
    }
  }
};

const ensureAuthenticated = async (req, res, next) => {
  await addDevUser(req);

  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};

const ensureModerator = async (req, res, next) => {
  await addDevUser(req);

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
