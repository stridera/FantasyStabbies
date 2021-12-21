const router = require("express").Router();
const { UniqueViolationError } = require("objection-db-errors");
const nominationRouter = require("./nominations");
const Category = require("../../models/category.model");
const { ensureModerator } = require("../../middleware/auth.middleware");
const { categorySchema } = require("../../../src/config/validation.schema");

const notFoundError = { status: 404, message: "Category not found." };

// Categories
router.get("/", async (req, res, next) => {
  try {
    const campaign = req.campaign;
    const categories = await Category.query().where("campaign", campaign.id).select([]);
    res.json({ campaign: campaign.id, categories });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const campaign = req.campaign;
    const category = await Category.query().findById(req.params.id);
    if (category && category.campaign === campaign.id) {
      res.json(category);
    }
    next(notFoundError);
  } catch (err) {
    next(err);
  }
});

router.post("/", ensureModerator, async (req, res, next) => {
  try {
    categorySchema
      .validate(req.body)
      .then(async (data) => {
        const campaign = req.campaign;
        const categories = await Category.query().insert({
          ...data,
          campaign: campaign.id,
        });
        return res.status(201).send({ campaign: campaign.id, categories });
      })
      .catch((err) => {
        if (err instanceof UniqueViolationError) {
          return next({ status: 409, message: "Category already exists." });
        }
        return next({ status: 400, message: err.message });
      });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureModerator, async (req, res, next) => {
  try {
    categorySchema
      .validate(req.body)
      .then(async (data) => {
        const results = await Category.query().patchAndFetchById(req.params.id, data);
        return res.send({ results });
      })
      .catch((err) => {
        return next(err);
      });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureModerator, async (req, res, next) => {
  try {
    const results = await Category.query().deleteById(req.params.id);
    return res.send({ results });
  } catch (err) {
    return next(err);
  }
});

// Nominations
router.use(
  "/:id/nominations",
  async (req, res, next) => {
    try {
      const campaign = req.campaign;
      const category = await Category.query().findById(req.params.id).where("campaign", campaign.id);
      if (category) {
        req.category = category;
        return next();
      } else {
        return next(notFoundError);
      }
    } catch (err) {
      return next(err);
    }
  },
  nominationRouter
);

module.exports = router;
