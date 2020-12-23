const RedditStrategy = require("passport-reddit").Strategy;
const User = require("../models/user.model");
const isMod = require("../services/mods");

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
          const existingUser = await User.query()
            .where("reddit_id", profile.id)
            .first();
          const isUserModerator = await isMod(profile.name);

          if (existingUser) {
            if (existingUser.is_moderator != isUserModerator) {
              existingUser.patch({ is_moderator: isUserModerator });
            }
            return done(null, existingUser);
          }

          // We don't have a user record with this ID, make a new record.
          // This is only stored to match votes to a name.

          const user = await User.query().insert({
            username: profile.name,
            reddit_id: profile.id,
            // iconURL: profile.icon_img,
            is_moderator: isUserModerator,
            reddit_created: new Date(profile._json.created_utc * 1000),
          });
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
    console.log("ID: ", id);
    User.query()
      .where("reddit_id", id)
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
