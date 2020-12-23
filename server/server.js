const express = require("express");
require("dotenv").config();

const path = require("path");
const app = express();

const session = require("express-session"); // Need to store state var for reddit auth
const bodyParser = require("body-parser"); // For parsing body
const passport = require("passport"); // Reddit/Goodreads Auth

// Logging Setup
const morgan = require("morgan");
const winston = require("./services/winston");

// Database
const pg = require("./db");

if (process.env.ENV == "production") {
  console.log("Trusting the proxy.");
  app.set("trust proxy", 1);
}

app.use(
  session({
    secret: "snoo fantasy stabbies",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.ENV != "dev" },
  })
);

// Allow serving the react app on prod
app.use(express.static(path.join(__dirname, "..", "build")));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Passport Sessions
require("./auth/reddit-auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Log requests
app.use(morgan("combined", { stream: winston.stream }));

// Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.use((err, req, res, next) => {
  // Fallback to default node handler
  if (res.headersSent) {
    next(err);
    return;
  }

  winston.error(err.message, { url: req.originalUrl });
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// App Configuration
const PORT = process.env.PORT || 5000;

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
