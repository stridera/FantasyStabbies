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
      required: ["category", "work", "user"],
      properties: {
        id: { type: "integer" },
        category: { type: "integer" },
        user: { type: "integer" },
        work: { type: "integer" },
      },
    };
  }
  static get relationMappings() {
    return {
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
