const router = require("express").Router();
const { ensureModerator } = require("../../middleware/auth.middleware");
const questionRouter = require("./questions");

const Campaigns = require("../../models/campaigns.model");
const { campaignSchema, updateCampaignSchema } = require("../../../src/config/validation.schema");

const getCampaign = async (query, publicOnly) => {
  if (publicOnly) {
    query.public = true;
  }
  const campaign = await Campaigns.findOne(query);
  return campaign;
};

// Campaigns
router.get("/", async (req, res) => {
  try {
    let query = Campaigns.find().select("-questions");
    if (!req.user.moderator) {
      query.where(public, true);
    }
    const campaigns = await query;
    res.send({ success: true, campaigns });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const campaign = await getCampaign({ _id: req.params.id }, !req.user.moderator);
    if (campaign) {
      res.send({ success: true, campaign });
    } else {
      return res.status(404).send({ success: false, error: "Campaign not found." });
    }
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

router.post("/", ensureModerator, async (req, res) => {
  try {
    campaignSchema
      .validate(req.body)
      .then(async (data) => {
        const campaign = new Campaigns(data);
        await campaign.save();
        return res.send({ success: true, campaign });
      })
      .catch((err) => {
        if (err.name == "ValidationError" || err.name == "MongoError") {
          return res.status(500).send({ success: false, error: err });
        }
        return res.status(500).send({ success: false, error: err.message });
      });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
});

router.patch("/:id", ensureModerator, async (req, res) => {
  try {
    updateCampaignSchema
      .validate(req.body)
      .then(async (data) => {
        const results = await Campaigns.updateOne({ _id: req.params.id }, data);
        return res.send({ success: true, results });
      })
      .catch((err) => {
        if (err.name == "ValidationError" || err.name == "MongoError") {
          return res.status(500).send({ success: false, error: err });
        }
        return res.status(500).send({ success: false, error: err.message });
      });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
});

router.delete("/:id", ensureModerator, async (req, res) => {
  try {
    const results = await Campaigns.deleteOne({ _id: req.params.id });
    return res.send({ success: true, results });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
});

// Questions
router.use(
  "/:id/questions",
  async (req, res, next) => {
    try {
      const campaign = await getCampaign({ _id: req.params.id }, !req.user.moderator);
      if (campaign) {
        req.campaign = campaign;
        next();
      } else {
        return res.status(404).send({ success: false, error: "Campaign not found." });
      }
    } catch (err) {
      res.status(500).send({ success: false, error: err.message });
    }
  },
  questionRouter
);

module.exports = router;
