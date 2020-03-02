const mongoCollections = require("../config/mongoCollections");
const animals = mongoCollections.animals;
const ObjectId = require('mongodb').ObjectID;

module.exports = {

    async create(name, animalType) {

        // error checking
        if (!name) throw "You must provide a name for your animal";

        if (!animalType) throw "You must provide a type of animal";

        if (typeof(name) != 'string') throw "Animal name must be a string";
        if (typeof(animalType) != 'string') throw "Animal type must be a string";

        // get db connection to animal collection
        const animalCollection = await animals();

        let newAnimal = {
            name: name,
            animalType: animalType
        };

        // perform insert
        const insertInfo = await animalCollection.insertOne(newAnimal);
        if (insertInfo.insertedCount === 0) throw "Could not add animal";

        return await this.get(insertInfo.insertedId.toString());
    },

    async getAll() {
        // return all the animals
        const animalCollection = await animals();
        return await animalCollection.find({}).toArray();
    },

    async get(id) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if(typeof(id) != 'string') throw "id should be a string";

        // get db connection to animal collection
        const animalCollection = await animals();

        // perform search
        const animal = await animalCollection.findOne({ _id: ObjectId(id) });
        if (animal === null) throw "No animal with given id";

        return animal;
    },    

    async remove(id) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if(typeof(id) != 'string') throw "id should be a string";

        // get db connection to animal collection
        const animalCollection = await animals();
        const animalBeingDeleted = await this.get(id);

        // perform delete
        const deletionInfo = await animalCollection.removeOne({ _id: ObjectId(id) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete animal with id of ${id}`;
        }

        return animalBeingDeleted;
    },

    async rename(id, newName) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if(typeof(id) != 'string') throw "id should be a string";

        if (!newName) throw "You must provide a new name for your animal";
        if(typeof(newName) != 'string') throw "newName should be a string";

        // get db connection to animal collection
        const animalCollection = await animals();
        const t_animal = await this.get(id);
        const updatedAnimal = {
            name: newName,
            animalType: t_animal.animalType
        };
        
        // perform update
        const updateInfo = await animalCollection.updateOne({ _id: ObjectId(id)}, {$set:updatedAnimal});
        if (updateInfo.modifiedCount === 0) {
            throw "could not update animal successfully";
        }

        return await this.get(id);
    }
};
