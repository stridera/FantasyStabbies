const addDevUser = (req) => {
  if (process.env.ENV == "dev" && req.headers.authorization == `Bearer ${process.env.DEV_TOKEN}`) {
    const ismod = req.headers["is-mod"] ? true : false;
    if (!req.user) {
      console.log(`Simulating user.  Moderator? ${ismod}`);
      req.user = {
        username: "stridera",
        userID: "5f32c7ae260586081a6626cb",
        redditID: "4aulo",
        moderator: ismod,
        created: "2020-08-11T16:30:38.564Z",
        loading: false,
        error: null,
      };
    } else {
      console.log("Marking existing user as moderator.");
      req.user.moderator = ismod;
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

  if (req.isAuthenticated() && req.user && req.user.moderator) {
    return next();
  } else {
    return res.sendStatus(403);
  }
};

module.exports = { ensureAuthenticated, ensureModerator };
