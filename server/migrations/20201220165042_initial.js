const Knex = require("knex");
const tableNames = require("../db/tableNames");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments("id");
    table.string("reddit_id", 8).notNullable().unique();
    table.string("username", 8).notNullable().unique();
    table.boolean("is_moderator").notNullable().defaultTo(false);
    table.timestamp("reddit_created").notNullable();
    table.boolean("is_banned").defaultTo(false);
    table
      .integer("banned_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable(tableNames.user);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.approvers, (table) => {
    table.increments("id");
    table.string("type").notNullable();
    table.string("approver").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.campaign, (table) => {
    table.increments("id");
    table.string("name").notNullable().unique();
    table.string("slug").notNullable().unique();
    table.boolean("public").notNullable().defaultTo(false);
    table.integer("min_account_age").notNullable().defaultTo(0);
    table.timestamp("nominate_start_date").notNullable();
    table.timestamp("nominate_end_date").notNullable();
    table.timestamp("vote_start_date").notNullable();
    table.timestamp("end_date").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.category, (table) => {
    table.increments("id");
    table.string("title", 255).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.work, (table) => {
    table.increments("id");
    table.string("title", 255).notNullable();
    table.string("author", 255);
    table.string("source", 255);
    table.string("source_url", 2000);
    table.string("image_url", 2000);
    table.string("note", 2000);
    table.boolean("is_valid").defaultTo(false);
    table
      .integer("approved_by")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(tableNames.user);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.nomination, (table) => {
    table.increments("id");
    table
      .integer("user")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(tableNames.user);
    table
      .integer("work")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(tableNames.work);
    table.timestamps(true, true);
  });

  await knex.schema.createTable(tableNames.votes, (table) => {
    table.increments("id");
    table
      .integer("user")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(tableNames.user);
    table
      .integer("nomination")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable(tableNames.nomination);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.votes,
      tableNames.nomination,
      tableNames.work,
      tableNames.approvers,
      tableNames.campaign,
      tableNames.question,
      tableNames.user,
    ].map((table) => knex.schema.dropTableIfExists(table))
  );
};

/*

const questionSchema = mongoose.Schema(
  {
    question: String,
    source: String,
    nominations: [nominationSchema],
  },
  { timestamps: true }
);

const campaignsSchema = mongoose.Schema(
  {
    endDate: Date,
    voteStart: Date,
    nominateStart: Date,
    minAge: Number,
    slug: { type: String, unique: true },
    campaignName: { type: String, unique: true },
    public: Boolean,
    questions: [questionSchema],
  },
  { timestamps: true }
);
 */
