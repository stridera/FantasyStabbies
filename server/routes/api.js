const router = require("express").Router();

const { ensureAuthenticated } = require("../middleware/auth.middleware");

const usersRouter = require("./api/users");
const campaignsRouter = require("./api/campaigns");
const searchRouter = require("./api/search");
const workRouter = require("./api/work");

router.use("/campaigns", ensureAuthenticated, campaignsRouter);
router.use("/search", ensureAuthenticated, searchRouter);
router.use("/users", ensureAuthenticated, usersRouter);
router.use("/work", ensureAuthenticated, workRouter);

module.exports = router;
