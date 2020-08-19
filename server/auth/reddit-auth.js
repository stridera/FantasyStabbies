const RedditStrategy = require("passport-reddit").Strategy;

const User = require("../models/user.model");
const isMod = require("../models/mods.model");

// Use the RedditStrategy within Passport.

const RedditAuth = (passport) => {
  passport.use(
    new RedditStrategy(
      {
        clientID: process.env.REDDIT_CONSUMER_KEY,
        clientSecret: process.env.REDDIT_CONSUMER_SECRET,
        callbackURL: process.env.REDDIT_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({ redditId: profile.id });
          const isUserModerator = await isMod(profile.name);

          if (existingUser) {
            existingUser.moderator = isUserModerator;
            existingUser.iconURL = profile.icon_img;
            existingUser.save();
            return done(null, existingUser);
          }

          // We don't have a user record with this ID, make a new record.
          // This is only stored to match votes to a name.
          const user = await new User({
            username: profile.name,
            redditId: profile.id,
            iconURL: profile.icon_img,
            moderator: isUserModerator,
            created: Date.now(profile.created),
          }).save();
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        console.log("Error with query during deserializing user ", error);
        done(error, null);
      });
  });
};

module.exports = RedditAuth;
