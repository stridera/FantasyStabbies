const { Model } = require("objection");
const { DBErrors } = require("objection-db-errors");

const tableNames = require("../db/tableNames");

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
      campaign: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./campaign.model"),
        join: {
          from: `${tableNames.nomination}.category_id`,
          through: {
            from: `${tableNames.category}.id`,
            to: `${tableNames.category}.campaign_id`,
          },
          to: `${tableNames.campaign}.id`,
        },
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./category.model"),
        join: {
          from: `${tableNames.nomination}.category_id`,
          to: `${tableNames.category}.id`,
        },
      },
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
      approved_by: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./user.model"),
        join: {
          from: `${tableNames.nomination}.approved_by`,
          to: `${tableNames.user}.id`,
        },
      },
      votes: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./vote.model"),
        join: {
          from: `${tableNames.nomination}.id`,
          to: `${tableNames.vote}.nomination_id`,
        },
      },
    };
  }
}

module.exports = Nomination;
