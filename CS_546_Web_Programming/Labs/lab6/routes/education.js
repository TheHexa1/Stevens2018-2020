const express = require("express");
const router = express.Router();

const myInfo = [
  {
    "schoolName": "Sheth C.M. High School",
    "degree": "High School Diploma",
    "favoriteClass": "Maths II",
    "favoriteMemory": "When teacher asked me to sit in the girls' section as punishment XD"
  },
  {
    "schoolName": "L.D. College of Engineering",
    "degree": "Bachelor's Degree",
    "favoriteClass": "Data Structures and Algorithms",
    "favoriteMemory": "Doing civil survey and stuff, though I was in computer engineering department _-_"
  },
  {
    "schoolName": "Stevens Institute of Technology",
    "degree": "Master's Degree",
    "favoriteClass": "CS 546-A",
    "favoriteMemory": "Doing Machine Learning assignments with my gang until midnight in library"
  }
]

router.get("/", async (req, res) => {
  res.json(myInfo)
});

module.exports = router;
