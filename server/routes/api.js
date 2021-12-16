const router = require("express").Router();

const { ensureAuthenticated } = require("../middleware/auth.middleware");

const usersRouter = require("./api/users");
const campaignsRouter = require("./api/campaigns");
const booksRouter = require("./api/books");

router.use("/users", ensureAuthenticated, usersRouter);
router.use("/campaigns", ensureAuthenticated, campaignsRouter);
router.use("/books", ensureAuthenticated, booksRouter);

module.exports = router;
