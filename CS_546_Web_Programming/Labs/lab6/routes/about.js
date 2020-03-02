const express = require("express");
const router = express.Router();

const myInfo = {
  "name": "Viveksinh Solanki",
  "cwid": "10441787",
  "biography": "I am pursuing master's in Computer Science at Stevens Institute Of Technology. "+ 
               "My major interest is in making machines understand human language.\n" +
               "I did my undergraduation from L.D. College Of Engineering, Ahmedabad with a major in Computer Engineering.",
  "favoriteShows": ["Naruto (Shippuden)", "One Piece", "My Hero Academia", "Dragon Ball Z", "Fairy Tail"],
  "hobbies": ["Online multiplayer games", "Watching Animes", "Reading philosophical books on AI"]
}

router.get("/", async (req, res) => {
  res.json(myInfo)
});

module.exports = router;
