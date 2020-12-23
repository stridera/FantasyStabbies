const { Model } = require("objection");

const tableNames = require("../db/tableNames");

class Campaigns extends Model {
  static get tableName() {
    return tableNames.campaign;
  }

  static get jsonSchema() {
    return {
      $schema: "http://json-schema.org/draft-07/schema",
      type: "object",
      title: "User",
      description: "The User",
      required: [
        "name",
        "slug",
        "nominate_start",
        "vote_start",
        "end_date",
        "public",
      ],
      additionalProperties: false,
      properties: {
        id: {
          $id: "#/properties/id",
          type: "integer",
          title: "The database ID of the campaign.",
        },
        name: {
          $id: "#/properties/name",
          type: "string",
          title: "The campaign name. Must be unique.",
          examples: ["2020 Stabbies"],
        },
        slug: {
          $id: "#/properties/slug",
          type: "string",
          title: "The slug, typically generated from the name.",
          examples: ["2020_stabbies"],
        },
        public: {
          $id: "#/properties/public",
          type: "boolean",
          title: "Is the campaign public (or mod only).",
        },
        min_age: {
          $id: "#/properties/min_account_age",
          type: "integer",
          title: "The minimum age for the reddit account in days",
        },
        nominate_start_date: {
          $id: "#/properties/nominate_start",
          type: "timestamp",
          title: "The date to start taking nominations",
        },
        nominate_end_date: {
          $id: "#/properties/nominate_start",
          type: "timestamp",
          title: "The date to start taking nominations",
        },
        vote_start_date: {
          $id: "#/properties/vote_start",
          type: "timestamp",
          title: "The date to stop nominations and start voting",
        },
        vote_end_date: {
          $id: "#/properties/vote_end_date",
          type: "timestamp",
          title: "The date to end voting",
        },
      },
    };
  }
}
module.exports = Campaigns;
