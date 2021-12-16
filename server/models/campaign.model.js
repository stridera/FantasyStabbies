const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

class Campaign extends DBErrors(Model) {
  static get tableName() {
    return tableNames.campaign;
  }

  static get jsonSchema() {
    return {
      type: "object",
      title: "Campaign",
      description: "A vote campaign.",
      required: [
        "name",
        "slug",
        "nominate_start_date",
        "nominate_end_date",
        "voting_start_date",
        "voting_end_date",
        "public",
      ],
      properties: {
        id: { type: "integer", title: "The database ID of the campaign." },
        name: { type: "string", title: "The campaign name. Must be unique.", examples: ["2020 Stabbies"] },
        slug: { type: "string", title: "The slug, typically generated from the name.", examples: ["2020_stabbies"] },
        public: { type: "boolean", title: "Is the campaign public (or mod only)." },
        min_account_age: { type: "integer", title: "The minimum age for the reddit account in days" },
        nominate_start_date: { type: "timestamp", title: "The date to start taking nominations" },
        nominate_end_date: { type: "timestamp", title: "The date to start taking nominations" },
        voting_start_date: { type: "timestamp", title: "The date to stop nominations and start voting" },
        voting_end_date: { type: "timestamp", title: "The date to end voting" },
      },
    };
  }
}
module.exports = Campaign;
