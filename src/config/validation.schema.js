const yup = require("yup");
const moment = require("moment");

const campaignSchema = yup.object().shape({
  campaignName: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  minAge: yup.number().positive().integer().required(),
  nominateStart: yup
    .date()
    .required()
    .min(moment().subtract(1, "days"), "Dates must be later than today."),
  voteStart: yup
    .date()
    .required()
    .min(
      yup.ref("nominateStart"),
      "Vote start must be after nomination start date."
    ),
  endDate: yup
    .date()
    .required()
    .min(
      yup.ref("nominateStart"),
      "Vote start must be after nomination start date."
    ),
});

const updateCampaignSchema = yup.object().shape({
  campaignName: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  minAge: yup.number().positive().integer().required(),
});

const questionSchema = yup.object().shape({
  question: yup.string().required().min(3).max(255),
  source: yup.string().required(),
});

const nominationSchema = yup.object().shape({});

module.exports = {
  campaignSchema,
  updateCampaignSchema,
  questionSchema,
  nominationSchema,
};
