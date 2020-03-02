const mongoCollections = require("../config/mongoCollections");
const animals = mongoCollections.animals;
const ObjectId = require('mongodb').ObjectID;

module.exports = {

    async create(name, animalType) {

        // error checking
        if (!name) throw "You must provide a name for your animal";

        if (!animalType) throw "You must provide a type of animal";

        if (typeof (name) != 'string') throw "Animal name must be a string";
        if (typeof (animalType) != 'string') throw "Animal type must be a string";

        // get db connection to animal collection
        const animalCollection = await animals();

        let newAnimal = {
            name: name,
            animalType: animalType,
            likes: [],
            posts: []
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
        if (typeof (id) != 'string') throw "id should be a string";

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
        if (typeof (id) != 'string') throw "id should be a string";

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

    async updateAnimal(id, updateProperties) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if (typeof (id) != 'string') throw "id should be a string";

        const { newName, newType } = updateProperties;

        // get db connection to animal collection
        const animalCollection = await animals();
        const t_animal = await this.get(id);

        var updatedAnimal;

        if (newName && newType){
            if (typeof (newName) != 'string') throw "animal name should be a string";
            if (typeof (newType) != 'string') throw "animale type should be a string";

            updatedAnimal = {
                name: newName,
                animalType: newType
            };
        }else if(newType){
            if (typeof (newType) != 'string') throw "animale type should be a string";

            updatedAnimal = {
                name: t_animal.name,
                animalType: newType
            };
        }else if(newName){
            if (typeof (newName) != 'string') throw "animal name should be a string";

            updatedAnimal = {
                name: newName,
                animalType: t_animal.animalType
            };
        }else throw "Please provide atleast one animal property!";        

        // perform update
        const updateInfo = await animalCollection.updateOne({ _id: ObjectId(id) }, { $set: updatedAnimal });
        if (updateInfo.modifiedCount === 0) {
            throw "could not update animal successfully";
        }

        return await this.get(id);
    },

    async updatePosts(id, postId, flag) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if (typeof (id) != 'string') throw "id should be a string";

        if (!postId) throw "You must provide a postId to search for";
        if (typeof (postId) != 'string') throw "postId should be a string";

        if (flag === undefined) throw "You must provide a flag to decide update or delete operation";
        if (typeof (flag) != 'boolean') throw "Identifier flag must be a boolean";

        // get db connection to animal collection
        const animalCollection = await animals();
        const t_animal = await this.get(id);

        const currentPosts = t_animal.posts;
        const currentLikes = t_animal.likes;
        // if flag = true then add post
        if (flag) {
            let postExists = false;
            currentPosts.some(function(e){
                if(e == postId){
                    postExists = true;
                    return;
                }
            });

            if(!postExists)
                currentPosts.push(postId);

            await this.likePost(id, postId, false);
        }else{ // else remove post
            
            var postIndex = 0;
            let postExists = false;
            currentPosts.some(function(e){
                if(e == postId){
                    postExists = true;
                    return;
                }
                postIndex += 1;
            });

            if(postExists)
                currentPosts.splice(postIndex, 1);
            
        }

        updatedAnimal = {
            name: t_animal.name,
            animalType: t_animal.animalType,
            likes: currentLikes,
            posts: currentPosts
        };

        // perform update -- check if the targetted post is updated or not
        const updatedInfo = await animalCollection.replaceOne(
            { _id: ObjectId(id) },
            updatedAnimal
        );
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update animal successfully";
        }

        return await this.get(id);
    },

    async likePost(id, postId, isLike) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if (typeof (id) != 'string') throw "id should be a string";

        if (!postId) throw "You must provide a postId to search for";
        if (typeof (postId) != 'string') throw "postId should be a string";

        if (isLike === undefined) throw "You must provide a boolean as third argument to decide like or dislike operation";
        if (typeof (isLike) != 'boolean') throw "Third argument must be a boolean";

        // get db connection to animal collection
        const animalCollection = await animals();
        const t_animal = await this.get(id);

        const currentLikes = t_animal.likes;

        // if isLike = true then like post
        if (isLike) {
            let postExists = false;

            // to prevent adding duplicate Ids
            currentLikes.some(function(e){
                if(e == postId){
                    postExists = true;
                    return;
                }
            });

            if(!postExists)
                currentLikes.push(postId);
        }else{ // else dislike post
            
            var postIndex = 0;
            let postExists = false;
            currentLikes.some(function(e){
                if(e == postId){
                    postExists = true;
                    return;
                }
                postIndex += 1;
            });

            if(postExists)
                currentLikes.splice(postIndex, 1);
        }

        updatedAnimal = {
            name: t_animal.name,
            animalType: t_animal.animalType,
            likes: currentLikes,
            posts: t_animal.posts
        };

        // perform update -- check if the targetted post is updated or not
        const updatedInfo = await animalCollection.replaceOne(
            { _id: ObjectId(id) },
            updatedAnimal
        );
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update animal successfully";
        }
    }
};
