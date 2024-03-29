const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

class Vote extends DBErrors(Model) {
  static get tableName() {
    return tableNames.vote;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["nomination_id", "user_id"],
      properties: {
        id: { type: "integer" },
        nomination_id: { type: "integer" },
        user_id: { type: "integer" },
      },
    };
  }

  static get relationMappings() {
    return {
      nomination: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./nomination.model"),
        join: {
          from: `${tableNames.vote}.nomination_id`,
          to: `${tableNames.nomination}.id`,
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./user.model"),
        join: {
          from: `${tableNames.vote}.user_id`,
          to: `${tableNames.user}.id`,
        },
      },
    };
  }
}

module.exports = Vote;
