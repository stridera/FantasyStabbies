const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");
const categoryRouter = require("./categories");

const Campaigns = require("../../models/campaign.model");

const { campaignSchema, updateCampaignSchema } = require("../../../src/config/validation.schema");

const notFoundError = { status: 404, message: "Campaign not found." };

// Campaigns
router.get("/", async (req, res, next) => {
  try {
    let campaigns = await Campaigns.query();

    if (req.user.is_moderator) {
      return res.send(campaigns);
    }

    return res.send(campaigns.filter((campaign) => campaign.public));
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const campaign = await Campaigns.query().findById(req.params.id);

    if (campaign && (campaign.public || req.user.is_moderator)) {
      return res.send(campaign);
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
        const campaign = await Campaigns.query().insert(data);
        return res.status(201).send(campaign);
      })
      .catch((err) => {
        return next({ status: 400, message: err.message });
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
        const results = await Campaigns.query().patchAndFetchById(req.params.id, data);
        return res.send({ results });
      })
      .catch((err) => {
        return next({ status: 400, message: err.message });
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
router.use(
  "/:id/category",
  async (req, res, next) => {
    try {
      const campaign = await Campaigns.query()
        .findById(req.params.id)
        .where((b) => {
          if (!req.user.is_moderator) b.where("public", true);
        });

      if (campaign) {
        req.campaign = campaign;
        return next();
      } else {
        return next(notFoundError);
      }
    } catch (err) {
      return next(err);
    }
  },
  categoryRouter
);

module.exports = router;
