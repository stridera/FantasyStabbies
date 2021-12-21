// App
const app = require("./app");

// App Configuration
const PORT = process.env.PORT || 5000;

// Logging Setup
const morgan = require("morgan");
const winston = require("./services/winston");

// Log requests
app.use(morgan("combined", { stream: winston.stream }));

// Log server errors
app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    next(err);
    return;
  }

  if (app.get("env") !== "test") winston.error(err.message, { url: req.originalUrl });
  res.status(err.status || 500);
  res.json({ error: err.message });
});

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
