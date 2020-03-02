const animals = require("./data/animals");
const connection = require("./config/mongoConnection");

const main = async () => {

  var sasha;
  try {
    sasha = await animals.create("Sasha", "Dog");
    console.log(sasha);
  } catch (e) {
    console.log(e);
  }

  var lucy;
  try {
    lucy = await animals.create("Lucy", "Dog");
    console.log(lucy);
  } catch (e) {
    console.log(e);
  }

  var all_animals;
  try {
    all_animals = await animals.getAll();
    console.log(all_animals);
  } catch (e) {
    console.log(e);
  }

  var duke;
  try {
    duke = await animals.create("Duke", "Walrus");
    console.log(duke);
  } catch (e) {
    console.log(e);
  }

  var sasha_updated;
  try {
    sasha_updated = await animals.rename(sasha._id.toString(), "Sashita");
    console.log(sasha_updated);
  } catch (e) {
    console.log(e);
  }

  var deleted_lucy;
  try {
    deleted_lucy = await animals.remove(lucy._id.toString());
  } catch (e) {
    console.log(e);
  }
  
  var remaining_animals;
  try {
    remaining_animals = await animals.getAll();
    console.log(remaining_animals);
  } catch (e) {
    console.log(e);
  }

  const db = await connection();
  await db.serverConfig.close();

  console.log("Connection closed!");
};

main();