const axios = require("axios");

const people_url = 'https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json';

async function getPeople() {
  const { data } = await axios.get(people_url);
  return data;
}

let exportedMethods = {
  async getAllMatchedPeople(name) {
    if (!name) throw "Please provide name to search for!";
    if (typeof (name) != 'string') throw "Name must be a string!";

    output = [];
    allPeople = await getPeople();
    allPeople.forEach(people => {
      if (people.firstName.toLowerCase().includes(name.toLowerCase()) || 
      people.lastName.toLowerCase().includes(name.toLowerCase())) {
        output.push({
          id: people.id,
          fullname: people.firstName + " " + people.lastName
        });
      }
    });
    return output.slice(0, 20);
  }
};

module.exports = exportedMethods;
