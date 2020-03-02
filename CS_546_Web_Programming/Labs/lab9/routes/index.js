const primeCheckerRoutes = require("./primeChecker");

const constructorMethod = app => {

  app.get("/", (req, res) => {
    res.render("primeChecker/static");
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Error code 404: Page not found!" });
  });
};

module.exports = constructorMethod;
