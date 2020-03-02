const detailsRoutes = require("./details");
const searchRoutes = require("./search");
const path = require("path");

const constructorMethod = app => {
  app.use("/search", searchRoutes);
  app.use("/details", detailsRoutes);
  app.get("/", (req, res) => {
    res.render("search/form", { hasError: false, error: "", title:"People Finder"});
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Error code 404: Page not found!" });
  });
};

module.exports = constructorMethod;
