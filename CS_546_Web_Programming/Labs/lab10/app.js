const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const usersData = require("./data/users.js");

const app = express();

const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");

app.use("/public", static);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware:
app.use(session({
  name: 'AuthCookie',
  secret: 'my auth cookie',
  resave: false,
  saveUninitialized: true
}));

// Navigate to localhost:3000
app.listen(3000, function () {
  console.log(
    "Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it"
  );
});

const bcrypt = require("bcrypt");
const saltRounds = 16;

async function matchHash(plainPwd, hashPwd) {
  let compareTopwd = false;

  try {
    compareTopwd = await bcrypt.compare(plainPwd, hashPwd);
  } catch (e) {
  }
  return compareTopwd;
}

app.use(function (req, res, next) {

  console.log("Current Timestamp: ", new Date().toUTCString());
  console.log("Request Method: ", req.method);
  console.log("Request Route: ",req.originalUrl);
  if (req.session.AuthCookie !== undefined) {
    console.log("Authenticated User!");
  } else {
    console.log("Non-authenticated User!");
  }
  next();
});

app.get("/", (req, res, next) => {
  if (req.session.AuthCookie !== undefined) {
    res.redirect("/private");
  } else {
    res.render("login/login", { hasError: false, title: "Login" });
  }
});

app.get("/private", (req, res, next) => {
  // console.log("private:", req.session);
  if (req.session.AuthCookie !== undefined) {
    var userdetails = undefined;
    usersData.forEach(user => {
      if (user.username === req.session.AuthCookie) {
        userdetails = user;
      }
    });
    res.render("layouts/userProfile", { userdetails: userdetails, title: "User Details" });
  } else {
    res.render("layouts/notLoggedIn", { status_code: 403, title:"Not logged in!" });
    res.status(403);
  }
});

app.post("/login", async (req, res) => {
  if (req.session.AuthCookie === undefined) {
    const userInfo = req.body;

    var hashPwd = undefined;
    usersData.forEach(user => {
      if (user.username === userInfo.username) {
        hashPwd = user.hashedPassword;
      }
    });

    const isMatch = await matchHash(userInfo.password, hashPwd);
    if (isMatch) {
      //store a cookie
      req.session.AuthCookie = userInfo.username;
      // console.log("inside login:", req.session);
      res.redirect("/private");
    } else {
      res.render("login/login", { hasError: true, title: "Login" });
    }
  } else {
    res.redirect("/private");
  }
});

app.get("/logout", (req, res) => {
  if (req.session.AuthCookie !== undefined) {
    req.session.destroy();

    // show 'you have been logged out' message
    res.render("layouts/logout", {title: "Logged Out"});
  } else {
    res.redirect("/");
  }

});

app.use("*", (req, res) => {
  res.redirect("/");
});
