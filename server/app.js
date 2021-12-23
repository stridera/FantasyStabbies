require("dotenv").config();

const express = require("express");
const session = require("express-session"); // Need to store state var for reddit auth
const app = express();
const path = require("path");

// Database
const pg = require("./db");

var sess = {
  secret: process.env.SESSION_SECRET || "snoo fantasy stabbies",
  resave: false,
  saveUninitialized: false,
  cookie: {},
};

app.use(session(sess));

// Allow serving the react app on prod
app.use(express.static(path.join(__dirname, "..", "build")));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const passport = require("passport"); // Reddit Auth

// Setup Passport Sessions - Here to skip the unit testing framework, which will mock it out
require("./auth/reddit-auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

if (app.get("env") === "production") {
  console.log("Production mode.  Trusting proxy, requiring secure cookies.");
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies

  app.use(express.static(path.join(__dirname, "..", "build")));
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
  });
}

module.exports = app;
