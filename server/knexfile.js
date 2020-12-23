// Update with your config settings.
require("dotenv").config({ path: "../.env" });

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    debug: true,
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DATABASE_HOSTNAME,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.DATABASE_CA_CERT,
      },
    },
  },
};
