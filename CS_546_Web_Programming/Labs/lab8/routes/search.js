const express = require("express");
const router = express.Router();
const data = require("../data");
const searchData = data.search;

router.post("/", async (req, res) => {
  personName = req.body.personName;
  // console.log(personName);
  if (!personName) {
    res.status(400);
    res.render("search/form", {
      hasError: true, error: "Please provide person name to search for!", title: "Person Finder"
    });
  } else {
    var peopleList = [];
    try {
      peopleList = await searchData.getAllMatchedPeople(personName);
    } catch (e) {
      res.status(400).json({ error: e });
    }
    // console.log(peopleList);
    if (peopleList.length != 0)
      res.render("search/searchresults", { personName: personName, people: peopleList, title: "People Found" });
    else
      res.render("search/notfound", { personName: personName, title: "People Not Found" });
  }
});

module.exports = router;
