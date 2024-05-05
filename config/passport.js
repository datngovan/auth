const { compareSync } = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("./db");

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!compareSync(password, user.password)) {
        //When password is invalid
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user); //When user is valid
    } catch (error) {
      return done(error);
    }
  })
);

//Persists user data inside session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Fetches session details using session id
passport.deserializeUser(async function (id, done) {
  try {
    const data = await UserModel.findById(id);
    done(null, data);
  } catch (error) {
    done(error);
  }
});
