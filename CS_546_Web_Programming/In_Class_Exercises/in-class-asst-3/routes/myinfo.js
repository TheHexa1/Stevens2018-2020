const express = require("express");
const router = express.Router();

const myInfo = { name: 'Viveksinh Solanki', dateOfBirth: '04/17', hometown: 'Gandhinagar' }

router.get("/", async (req, res) => {
  res.json(myInfo)
});

module.exports = router;
