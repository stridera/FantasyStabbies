const router = require("express").Router();
const { UniqueViolationError } = require("objection-db-errors");
const { ensureModerator, ensureAccountOldEnough } = require("../../middleware/auth.middleware");
const Work = require("../../models/work.model");
const { workSchema } = require("../../../src/config/validation.schema");
const GoogleBooksService = require("../../services/googlebooks");

router.get("/:id", async (req, res, next) => {
  try {
    const work = await Work.query().findOne({ google_book_id: req.params.id });
    return res.json(work);
  } catch (err) {
    return next(err);
  }
});

router.post("/google_books", async (req, res, next) => {
  try {
    const google_book_id = req.body.google_book_id;

    if (!google_book_id) {
      return res.status(400).json({ message: "Missing google_book_id" });
    }

    // Check to see if it has already been added to the database.
    const work = await Work.query().findOne({ google_book_id: google_book_id });
    if (work) {
      return res.status(201).json(work);
    }

    // If here, we need to add it.
    const data = await GoogleBooksService.byId(google_book_id);
    if (!data) {
      return next({ status: 400, message: "Google book not found." });
    }

    Work.query()
      .insert(data)
      .then((work) => {
        return res.status(201).json(work);
      });
  } catch (err) {
    return next(err);
  }
});

router.post("/manual", async (req, res, next) => {
  try {
    workSchema
      .validate(req.body)
      .then(async (data) => {
        Work.query()
          .insert(data)
          .then(async (work) => {
            return res.status(201).json(work);
          })
          .catch(async (err) => {
            if (err instanceof UniqueViolationError) {
              return res.status(400).json({ error: "Work already exists." });
            }
            return next(err);
          });
      })
      .catch((err) => {
        return next({ status: 400, message: err.message });
      });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
