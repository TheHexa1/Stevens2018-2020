const mongoCollections = require('../config/mongoCollections');
const bands = mongoCollections.bands;
const ObjectId = require('mongodb').ObjectID;

let exportedMethods = {
  async getAllBands() {    
    const bandsCollection = await bands();
    return await bandsCollection.find().toArray();
  },
  async getBandById(id) {
    if (id === undefined) throw 'You must provide an ID';
    const bandsCollection = await bands();
    const band = await bandsCollection.findOne({ _id: ObjectId(id) });
    if (!band) {
      throw 'Could not find band with id of ' + id;
    }
    return band;
  },
  async addBand(bandName, bandMembers, yearFormed, genres, recordLabel) {   

    //Error-checking
    if (bandName === undefined || typeof (bandName) == 'number') throw "bandName is not valid!";
    if (bandMembers === undefined || bandMembers == []) throw "band members cannot be empty!";
    if (yearFormed === undefined) throw "yearFormed must be valid!";
    if (yearFormed < 1900 || yearFormed > 2019) throw "Yearformed must be between 1900 and 2019";
    if (genres === undefined || genres.length < 1 || genres == []) throw "Genre array should have atleast 1 element!";
    if (recordLabel === undefined) throw "recordlabel cannot be empty!";

    const newBand = {
      bandName: bandName,
      bandMembers: bandMembers,
      yearFormed: yearFormed,
      genre: genres,
      recordLabel: recordLabel
    }
    const bandsCollection = await bands();
    await bandsCollection.insert(newBand, function (error, result) {
      if (error) {
        console.log(error);
        throw error;
      } else
        return (newBand);
    });
  },
  async removeBand(id) {
    //If not found or not removed, throw an error.
    if (id === undefined) return Promise.reject('No id provided');
    const bandsCollection = await bands();
    return await bandsCollection.remove({ _id: ObjectId(id) }).then(function () {
      return exportedMethods.getAllBands();
    });
  },
  async searchBandByName(bandName) {  

    if (!bandName) throw 'You must provide a band name';
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'bandName': bandName }).toArray();
  },
  async searchBandMemberFullName(firstName, lastName) {    
    console.log(firstName, lastName);
    if (firstName === undefined) throw 'You must provide a firstname';
    if (lastName === undefined) throw 'You must provide a lastname';
    const bandsCollection = await bands();
    return await bandsCollection.find({
      $and: [{ 'bandMembers.firstName': firstName }, { 'bandMembers.lastName': lastName }]
    }).toArray();
  },
  async searchBandMember(name) {    
    if (!name) throw 'You must provide a name';
    let regex = new RegExp([".*", name, ".*"].join(""), "i");
    console.log(regex);
    const bandsCollection = await bands();
    return await bandsCollection.find({
      $or: [{ "bandMembers.firstName": regex }, { "bandMembers.lastName": regex }]
    }).toArray();
  },
  async searchBandByGenre(genre) {    
    if (!genre) throw 'You must provide a genre';    

    const bandsCollection = await bands();
    
    return await bandsCollection.find({ genre: { $in: genre } }).toArray();
  },
  async searchBandByYear(year) {    
    if (year === undefined) throw 'You must provide a year';
    
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'yearFormed': parseInt(year) }).toArray();
  },
  async searchBandFormedBefore(year) {   
    if (year === undefined) throw 'You must give a year';
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'yearFormed': { $lt: parseInt(year) } }).toArray();
  },
  async searchBandFormedOnOrBefore(year) {
    
    if (year === undefined) throw 'You must give a valid year';
    console.log(typeof(year));
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'yearFormed': { $lte: parseInt(year) } }).toArray();
  },
  async searchBandFormedAfter(year) {
    
    if (year === undefined) throw 'You must give a year';
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'yearFormed': { $gt: parseInt(year) } }).toArray();
  },
  async searchBandFormedOnOrAfter(year) {
    
    if (year === undefined) throw 'You must give a year';
    const bandsCollection = await bands();
    return await bandsCollection.find({ 'yearFormed': { $gte: parseInt(year) } }).toArray();
  },
  async addBandMember(bandId, firstName, lastName) {
    
    if (bandId === undefined) return Promise.reject('No id provided');
    if (firstName === undefined) return Promise.reject('no firstName provided');
    if (lastName === undefined) return Promise.reject('no lastName provided');

    const bandMembers = {firstName: firstName, lastName: lastName}

    const bandsCollection = await bands();
    return await bandsCollection.update({ _id: ObjectId(bandId) }, {
      $addToSet: { bandMembers: bandMembers } 
    }).then(function () {
      return exportedMethods.getBandById(bandId);
    });
  },
  async removeBandMember(bandId, firstName, lastName) {
    
    if (bandId === undefined) return Promise.reject('No id provided');
    if (firstName === undefined) return Promise.reject('no firstName provided');
    if (lastName === undefined) return Promise.reject('no lastName provided');

    const bandMembers = {firstName: firstName, lastName: lastName}

    const bandsCollection = await bands();
    return await bandsCollection.update({ _id: ObjectId(bandId) }, {
      $pull: { bandMembers: bandMembers }
    }).then(function () {
      return exportedMethods.getBandById(bandId);
    });
  }
};

module.exports = exportedMethods;
