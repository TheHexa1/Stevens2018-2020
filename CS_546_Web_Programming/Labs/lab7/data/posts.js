const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const animals = require("./animals");
const ObjectId = require('mongodb').ObjectID;

module.exports = {
    async getPostById(id) {
        if (!id) throw "You must provide an id to search for post";
        if (typeof(id) != 'string') throw "id should be a string";

        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: ObjectId(id) });
        if (post === null) throw "No post with that id";

        return post;
    },
    async getAllPosts() {
        const postCollection = await posts();

        const allPosts = await postCollection.find({}).toArray();

        return allPosts;
    },
    async addPost(title, author, content) {
        if (!title) throw "You must provide a title";
        if (!author) throw "You must provide an author";
        if (!content) throw "You must provide a content";

        if (typeof (title) != 'string') throw "Post title must be a string";
        if (typeof (author) != 'string') throw "Post author must be a string";
        if (typeof (content) != 'string') throw "Post content must be a string";

        const postCollection = await posts();

        const newPostInfo = {
            title: title,
            author: author,
            content: content
        };

        const insertInfo = await postCollection.insertOne(newPostInfo);
        if (insertInfo.insertedCount === 0) throw "Could not add post";

        // update posts into animals db
        const updatedAnimals = await animals.updatePosts(author, insertInfo.insertedId.toString(), true);
        const newPost = await this.getPostById(insertInfo.insertedId.toString());

        return newPost;
    },
    async removePost(postId, author) {
        if (!postId) throw "You must provide a post id to remove a post";
        if (typeof(postId) != 'string') throw "post id should be a string";

        if (!author) throw "You must provide an author id to remove a post";
        if (typeof(author) != 'string') throw "author id should be a string";

        const postCollection = await posts();
        const deletionInfo = await postCollection.removeOne({ _id: ObjectId(postId) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${postId}`;
        }

        // update posts into corresponding animal
        await animals.updatePosts(author, postId, false);
        await animals.likePost(author, postId, false);
    },
    async removeAllPosts(author) {
        if (!author) throw "You must provide an author id to remove posts";
        if (typeof(author) != 'string') throw "author id should be a string";
        
        const postCollection = await posts();
        const deletionInfo = await postCollection.remove({author: author});

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete posts from ${postId}`;
        }        
    },
    async updatePost(id, updateProperties) {
        if (!id) throw "You must provide a post id";
        if (typeof (id) != 'string') throw "id should be a string";

        const { newTitle, newContent } = updateProperties;

        const postCollection = await posts();
        const t_post = await this.getPostById(id);

        let updatedPost;              

        if (newTitle && newContent){
            if (typeof (newTitle) != 'string') throw "post title should be a string";
            if (typeof (newContent) != 'string') throw "post content should be a string";

            updatedPost = {
                title: newTitle,
                author: t_post.author,
                content: newContent
            };
        }else if(newTitle){
            if (typeof (newTitle) != 'string') throw "post title should be a string";

            updatedPost = {
                title: newTitle,
                author: t_post.author,
                content: t_post.content
            };
        }else if(newContent){
            if (typeof (newContent) != 'string') throw "post content should be a string";

            updatedPost = {
                title: t_post.title,
                author: t_post.author,
                content: newContent
            };
        }else throw "Please provide either post title or post content to update!";

        const updatedInfo = await postCollection.replaceOne(
            { _id: ObjectId(id) },
            updatedPost
        );

        if (updatedInfo.modifiedCount === 0) {
            throw "could not update post successfully";
        }

        return await this.getPostById(id);
    }
};