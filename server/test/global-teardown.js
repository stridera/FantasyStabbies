const { connectToTestDatabase, resetMigrations } = require("./utils");
module.exports = async () => {
  const knex = await connectToTestDatabase();
  try {
    await resetMigrations(knex);
  } catch (error) {
    console.log("Error during global-teardown:", error);
    process.exit(1);
  } finally {
    knex.destroy();
  }
};
