const yup = require("yup");
const moment = require("moment");

const campaignSchema = yup.object().shape({
  name: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  min_account_age: yup.number().positive().integer(),
  nominate_start_date: yup.date().required().min(moment().subtract(1, "days"), "Dates must be later than today."),
  nominate_end_date: yup
    .date()
    .required()
    .min(yup.ref("nominate_start_date"), "Nomination end must be after it starts."),
  voting_start_date: yup
    .date()
    .required()
    .min(yup.ref("nominate_end_date"), "Vote start must be after the nomination ends."),
  voting_end_date: yup.date().required().min(yup.ref("voting_start_date"), "Vote end must be after vote start date."),
  public: yup.boolean(),
});

const updateCampaignSchema = yup.object().shape({
  name: yup.string().required().min(3),
  slug: yup.string().required().min(3),
  min_age: yup.number().positive().integer().required(),
  public: yup.boolean(),
});

const categorySchema = yup.object().shape({
  title: yup.string().required().min(3).max(255),
  description: yup.string().min(3).max(255),
  source: yup.string().required().min(3).max(255),
});

const nominationSchema = yup.object().shape({
  work: yup.number().positive().integer().required(),
  approved: yup.boolean().isFalse(), // Should not be set by the user
  approved_by: yup.boolean().isFalse(), // Should not be set by the user
});

const workSchema = yup.object().shape({
  source: yup.string().required().min(3).max(255),
  title: yup.string().required().min(3).max(255),
  authors: yup.string().required().min(3).max(255),
  publisher: yup.string().max(255),
  published_date: yup.string(),
  source_url: yup.string().url().required(),
  image_url: yup.string().url(),
  note: yup.string().max(255),
});

const redditUserSchema = yup.object().shape({
  url: yup
    .string()
    .required()
    .min(3)
    .max(255)
    .matches(/^(?:(?:https?):\/\/)?(?:www\.)?(?:reddit\.com)?(?:\/u(?:ser)?\/)?([a-z0-9]+)$/, "Enter correct url!")
    .required("Please enter website"),
});

module.exports = {
  campaignSchema,
  updateCampaignSchema,
  categorySchema,
  nominationSchema,
  workSchema,
};
