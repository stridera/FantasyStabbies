const express = require("express");
require("dotenv").config();

const app = express();

const session = require("express-session"); // Need to store state var for reddit auth
const bodyParser = require("body-parser"); // For parsing body
const passport = require("passport");
const authMiddleware = require("./modules/auth-middleware");
const mongoose = require("mongoose"); // DB

mongoose.connect("mongodb://localhost:27017/fantasy", {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(
  session({
    secret: "snoo fantasy stabbies",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.ENV != "dev" },
  })
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(authMiddleware);

// Setup Passport Sessions
require("./auth/reddit-auth")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

// App Configuration
const PORT = process.env.PORT || 5000;

/** Listen **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
