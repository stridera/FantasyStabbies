const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");
const Nomination = require("./nomination.model");
const Vote = require("./vote.model");

class Category extends DBErrors(Model) {
  static get tableName() {
    return tableNames.category;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["title"],
      properties: {
        id: { type: "integer" },
        campaign_id: { type: "integer" },
        title: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "string", minLength: 1, maxLength: 255 },
        type: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  static get relationMappings() {
    return {
      votes: {
        relation: Model.ManyToManyRelation,
        modelClass: Vote,
        join: {
          from: `${tableNames.category}.id`,
          through: {
            from: `${tableNames.nomination}.category`,
            to: `${tableNames.nomination}.nomination`,
          },
          to: `${tableNames.vote}.nomination`,
        },
      },
    };
  }
}

module.exports = Category;
