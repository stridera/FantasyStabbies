const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");
// const questionRouter = require("./questions");

const Campaigns = require("../../models/campaigns.model");

const {
  campaignSchema,
  updateCampaignSchema,
} = require("../../../src/config/validation.schema");

const notFoundError = { status: 404, message: "Campaign not found." };

// Campaigns
router.get("/", async (req, res, next) => {
  try {
    const campaigns = await Campaigns.query().where(
      "public",
      !req.user.moderator
    );
    return res.send({ campaigns });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const campaign = await getCampaign(
      { _id: req.params.id },
      !req.user.moderator
    );
    if (campaign) {
      return res.send({ campaign });
    } else {
      return next(notFoundError);
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureModerator, async (req, res, next) => {
  try {
    campaignSchema
      .validate(req.body)
      .then(async (data) => {
        const campaign = Campaigns.query().insert(data);
        return res.send({ campaign });
      })
      .catch((err) => {
        return next(err);
      });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:id", ensureModerator, async (req, res, next) => {
  try {
    updateCampaignSchema
      .validate(req.body)
      .then(async (data) => {
        const results = await Campaigns.query().patchAndFetchById(
          req.params.id,
          data
        );
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
    const results = await Campaigns.query().deleteById(req.params.id);
    return res.send({ results });
  } catch (err) {
    return next(err);
  }
});

// Categories
// router.use(
//   "/:id/category",
//   async (req, res, next) => {
//     try {
//       const campaign = await Campaigns.query()
//         .findById(req.params.id)
//         .where("public", !req.user.moderator);

//       if (campaign) {
//         req.campaign = campaign;
//         return next();
//       } else {
//         return next(notFoundError);
//       }
//     } catch (err) {
//       return next(err);
//     }
//   },
//   questionRouter
// );

module.exports = router;
