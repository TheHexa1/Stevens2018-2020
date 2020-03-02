const axios = require("axios");
const people_url = 'https://gist.githubusercontent.com/robherley/5112d73f5c69a632ef3ae9b7b3073f78/raw/24a7e1453e65a26a8aa12cd0fb266ed9679816aa/people.json';

async function getPeople(){
  const {data} = await axios.get(people_url);
  return data;
}

let exportedMethods = {

  async getUserById(id) {
    if (id == undefined) { throw 'Please pass valid id!' };
    if (typeof (id) != 'number') { throw 'id should be a number!' };

    data = await getPeople();
    var n_people = data.length;

    if (id < 1 || id > n_people) { throw 'id is OutOfBounds!' };
    console.log("id:",id);
    for (let i = 0; i < n_people; i++) {
      let temp_person = data[i];
      if (temp_person.id == id) {
        return temp_person;
      }
    }
  }
};

module.exports = exportedMethods;
