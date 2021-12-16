const { connectToTestDatabase, resetMigrations, migrateToLatest, seedDatabase } = require("./utils");
module.exports = async () => {
  const knex = await connectToTestDatabase();
  try {
    await resetMigrations(knex);
    await migrateToLatest(knex);
    await seedDatabase(knex);
  } catch (error) {
    console.log(error);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
};
