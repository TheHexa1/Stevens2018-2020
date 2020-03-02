const express = require('express');
const router = express.Router();
const data = require('../data');
const bandData = data.bands;


router.get('/:id', async (req, res) => {
  console.log(req.params.id);
  try {
    const band = await bandData.getBandById(req.params.id);
    res.json(band);
  } catch (e) {
    res.status(404).json({ error: 'Band not found' });
  }
});

router.get('/genre/:genre', async (req, res) => {
  
  try {
    const band = await bandData.searchBandByGenre(Array(req.params.genre));
    console.log(req.params.genre);
    // console.log(band);
    res.json(band);
  } catch (e) {
    res.status(404).json({ error: e+' Band not found' });
  }
});

router.get('/', async (req, res) => {
  try {
    const bandList = await bandData.getAllBands();
    res.json(bandList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/search/bandmember', async (req, res) => {
  try {
    var bandmember;
    if (req.body.name) {
      console.log(req.body.name);
      bandmember = await bandData.searchBandMember(req.body.name)
    } else if (req.body.firstName && req.body.lastName) {
      console.log(req.body.firstName + ' ' + req.body.lastName);
      bandmember = await bandData.searchBandMemberFullName(req.body.firstName, req.body.lastName);
    }
    res.json(bandmember);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/search/bandName', async (req, res) => {
  let bandName = req.body.bandName;
  let band;
  try {
    band = await bandData.searchBandByName(bandName);
    res.json(band);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/search/year', async (req, res) => {
  let range = req.body.yearRange;
  let year = req.body.year;
  let band;
  console.log(range, year);
  try {

    if (range === "exact") {
      band = await bandData.searchBandByYear(year);
    } else if (range === "after") {
      band = await bandData.searchBandFormedAfter(year);
    } else if (range === "before") {
      band = await bandData.searchBandFormedBefore(year);
    } else if (range === "onOrBefore") {
      band = await bandData.searchBandFormedOnOrBefore(year);
    } else if (range === "onOrAfter") {
      band = await bandData.searchBandFormedOnOrAfter(year);
    } else {
      res.status(500).json({ error: "Please define valid  year range!" });
    }
    res.json(band);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/:id/bandmembers', async (req, res) => {
  try {
    let bandId = req.params.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let output = await bandData.addBandMember(bandId, firstName, lastName);
    res.json(output);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete('/:id/bandmembers', async (req, res) => {
  console.log(req.params.id);
  try {
    let bandId = req.params.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let output = await bandData.removeBandMember(bandId, firstName, lastName);
    res.json(output);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  console.log(req.params.id);
  
  try {
    let bandId = req.params.id;
    let output = await bandData.removeBand(bandId);
    res.json(output);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
