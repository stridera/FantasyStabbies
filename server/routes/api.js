const router = require("express").Router();

const { ensureAuthenticated } = require("../middleware/auth.middleware");

const userRouter = require("./api/user");
const campaignRouter = require("./api/campaigns");
const goodreadsRouter = require("./api/goodreads");

router.use("/user", ensureAuthenticated, userRouter);
router.use("/campaigns", ensureAuthenticated, campaignRouter);
router.use("/goodreads", ensureAuthenticated, goodreadsRouter);

module.exports = router;
