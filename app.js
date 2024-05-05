const { hashSync } = require("bcrypt");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const UserModel = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://datngo:datngo123@cluster0.zkx2xob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/login",
  passport.authenticate("local", { successRedirect: "protected" })
);

app.post("/register", (req, res) => {
  let user = new UserModel({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });

  user.save().then((user) => console.log(user));

  res.send({ success: true });
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("Protected", Protected);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
  console.log(req.session);
  console.log(req.user);
});

app.listen(PORT, (req, res) => {
  console.log("Listening to port 5000");
});
