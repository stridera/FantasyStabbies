const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { ensureAuthenticated };
