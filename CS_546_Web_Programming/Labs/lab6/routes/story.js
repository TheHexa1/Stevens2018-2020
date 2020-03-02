const express = require("express");
const router = express.Router();

const myInfo = {
  "storyTitle": "My extra curricular activities",
  "story": "I was selected as a 'Google Facilitator' as part of Google's new initiative called 'Applied CS with Android'. " +
  "I delivered 3 workshops on Android Development under this program with total 150+ participants in our college. "+
  "Also, I hosted Google I/O Extended-2016 watch party fully sponsored by Google in our college.\n"+
  "I was runner-up in the state level coding-treasure event called 'Questography' organized in GTU-Techfest2015. "+
  "I was the event manager in the IEEE Spotlight2015 and successfully organized coding event called 'Code Crackers'"+
  "with 50+ participants. \n"+
  "I volunteered at One-To-World office in NYC for their annual fund raising event."
}

router.get("/", async (req, res) => {
  res.json(myInfo)
});

module.exports = router;
