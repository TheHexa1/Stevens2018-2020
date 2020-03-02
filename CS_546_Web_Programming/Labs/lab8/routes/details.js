const express = require("express");
const router = express.Router();
const data = require("../data");
const detailsData = data.details;

router.get("/:id", (req, res) => {
  if (!req.params.id) {
    res.render("layouts/error", { error: "Please provide person id to search for person!" });
    res.status(400).json({ error: "Input Error!" });
  } else {
    detailsData
      .getUserById(parseInt(req.params.id))
      .then(person => {
        res.render("details/single", {
          people: person, title: "Person Found",
          personName: person.firstName + " " + person.lastName
        });
      })
      .catch((e) => {
        res.status(400).json({ error: e });
      });
  }
});
module.exports = router;
