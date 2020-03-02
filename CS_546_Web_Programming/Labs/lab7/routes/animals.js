const express = require('express');
const router = express.Router();
const data = require('../data');
const animalsData = data.animals;
const postsData = data.posts;

// Json schema validator
const djv = require('djv');
const env = djv();

const jsonSchema = {
    "required": [
        "name",
        "animalType"
    ]
};

// Add json-schema
env.addSchema('postAnimal', jsonSchema);


router.get('/', async (req, res) => {
    try {
        const animalsList = await animalsData.getAll();
        const modifiedAnimalsList = []

        for(const animal of animalsList){
            let likes = []
            let posts = []

            for(const likeId of animal.likes){
                const post = await postsData.getPostById(likeId);
                likes.push({
                    "_id": likeId,
                    "title": post.title
                });
            }

            for(const postId of animal.posts){
                const post = await postsData.getPostById(postId);
                posts.push({
                    "_id": postId,
                    "title": post.title
                });
            }

            modifiedAnimalsList.push({
                _id: animal._id,
                name: animal.name,
                animalType: animal.animalType,
                likes: likes,
                posts: posts
            })
        }

        res.json(modifiedAnimalsList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async (req, res) => {
    const input = req.body;

    if (env.validate('postAnimal', input) !== undefined)
        res.status(400).json({ error: "Input doesn't match schema!" });
    else {

        try {
            const { name, animalType } = input;
            const newAnimal = await animalsData.create(name, animalType);
            res.json(newAnimal);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const animal = await animalsData.get(req.params.id);

        let likes = []
        let posts = []

        for(const likeId of animal.likes){
            const post = await postsData.getPostById(likeId);
            likes.push({
                "_id": likeId,
                "title": post.title
            });
        }

        for(const postId of animal.posts){
            const post = await postsData.getPostById(postId);
            posts.push({
                "_id": postId,
                "title": post.title
            });
        }

        res.json({
            _id: animal._id,
            name: animal.name,
            animalType: animal.animalType,
            likes: likes,
            posts: posts
        });

    } catch (e) {
        res.status(404).json({ error: 'Animal not found' });
    }
});

router.put('/:id', async (req, res) => {
    const updatedData = req.body;

    if(updatedData.newName || updatedData.newType){

        try {
            await animalsData.get(req.params.id);
        } catch (e) {
            res.status(404).json({ error: 'Animal not found' });
        }
    
        try {
            const updatedAnimal = await animalsData.updateAnimal(req.params.id, updatedData);
            res.json(updatedAnimal);
        } catch (e) {
            res.status(500).json({ error: e });
        }

    }else{
        res.status(400).json({ error: "Please provide atleast one property" });
    }
    
});

router.delete('/:id', async (req, res) => {

    var animal;
	try {
		animal = await animalsData.get(req.params.id);
	} catch (e) {
		res.status(404).json({ error: 'Animal not found' });
	}
	try {

        let likes = []
        let posts = []

        for(const likeId of animal.likes){
            const post = await postsData.getPostById(likeId);
            likes.push({
                "_id": likeId,
                "title": post.title
            });
        }

        for(const postId of animal.posts){
            const post = await postsData.getPostById(postId);
            posts.push({
                "_id": postId,
                "title": post.title
            });
        }
        
        output = {
            "deleted": true,
            "data": {
                "_id": animal._id, 
                "name": animal.name,
                "animalType": animal.animalType,
                "likes": likes,
                "posts": posts
            }
        }

        await animalsData.remove(req.params.id);
        await postsData.removeAllPosts(req.params.id);
        
		res.json(output);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});


module.exports = router;
