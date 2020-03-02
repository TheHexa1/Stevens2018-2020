const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.render("primeChecker/static", {});
});

module.exports = router;
