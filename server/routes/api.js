const router = require("express").Router();

const { ensureAuthenticated } = require("../modules/auth-middleware");

const userRouter = require("./api/user");
router.use("/user", ensureAuthenticated, userRouter);

module.exports = router;
