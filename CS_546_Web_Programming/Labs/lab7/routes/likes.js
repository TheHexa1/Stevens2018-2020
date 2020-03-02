const express = require('express');
const router = express.Router();
const data = require('../data');
const animalsData = data.animals;
const postsData = data.posts;


router.post('/:id', async (req, res) => {
    const animalId = req.params.id;
    const postId = req.query.postId;

    try {
        await animalsData.get(animalId);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        await postsData.getPostById(postId);
    } catch (e) {
        res.status(404).json({ error: e });
    }

    try {
        await animalsData.likePost(animalId, postId, true);
        res.json("Liked!");
    } catch (e) {
        res.status(500).json({ error: e });
    }    
});

router.delete('/:id', async (req, res) => {

    const animalId = req.params.id;
    const postId = req.query.postId;

    try {
        await animalsData.get(animalId);
    } catch (e) {
        res.status(404).json({ error: 'Animal not found' });
    }

    try {
        await postsData.getPostById(postId);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }

    try {
        await animalsData.likePost(animalId, postId, false);
        res.json("Disliked!");
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
