const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");
const Vote = require("./vote.model");

class Nomination extends DBErrors(Model) {
  static get tableName() {
    return tableNames.nomination;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["category_id", "work_id", "user_id"],
      properties: {
        id: { type: "integer" },
        category_id: { type: "integer" },
        user_id: { type: "integer" },
        work_id: { type: "integer" },
        approved: { type: "boolean" },
        approved_by: { type: "integer" },
      },
    };
  }
  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./user.model"),
        join: {
          from: `${tableNames.nomination}.user_id`,
          to: `${tableNames.user}.id`,
        },
      },
      work: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./work.model"),
        join: {
          from: `${tableNames.nomination}.work_id`,
          to: `${tableNames.work}.id`,
        },
      },
      votes: {
        relation: Model.ManyToManyRelation,
        modelClass: Vote,
        join: {
          from: `${tableNames.nomination}.id`,
          to: `${tableNames.vote}.nomination`,
        },
      },
    };
  }
}

module.exports = Nomination;
