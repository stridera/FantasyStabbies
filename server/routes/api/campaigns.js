const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");
const questionRouter = require("./questions");

const Campaigns = require("../../models/campaigns.model");
const { campaignSchema, updateCampaignSchema } = require("../../../src/config/validation.schema");

const notFoundError = { status: 404, message: "Campaign not found." };

const getCampaign = async (condition, publicOnly = true, skipQuestions = true) => {
  let query = Campaigns.findOne(condition);
  if (skipQuestions) {
    query.select("-questions");
  }
  if (publicOnly) {
    query.where("public", true);
  }
  return await query;
};

// Campaigns
router.get("/", async (req, res, next) => {
  try {
    let query = Campaigns.find().select("-questions");
    if (!req.user.moderator) {
      query.where("public", true);
    }
    const campaigns = await query;
    return res.send({ campaigns });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const campaign = await getCampaign({ _id: req.params.id }, !req.user.moderator);
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
        const campaign = new Campaigns(data);
        await campaign.save();
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
        const results = await Campaigns.updateOne({ _id: req.params.id }, data);
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
    const results = await Campaigns.deleteOne({ _id: req.params.id });
    return res.send({ results });
  } catch (err) {
    return next(err);
  }
});

// Questions
router.use(
  "/:id/questions",
  async (req, res, next) => {
    try {
      const campaign = await getCampaign({ _id: req.params.id }, !req.user.moderator, false);
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
  questionRouter
);

module.exports = router;
