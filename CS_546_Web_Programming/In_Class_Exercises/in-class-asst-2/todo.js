const mongoCollections = require("./config/mongoCollections");
const todoItems = mongoCollections.todoItems;
const ObjectId = require('mongodb').ObjectID;

module.exports = {

  async createTask(title, description) {

        // error checking
        if (!title) throw "You must provide a title for your todo";

        if (!description) throw "You must provide a description of todo";

        if (typeof(title) != 'string') throw "Todo title must be a string";
        if (typeof(description) != 'string') throw "Todo description must be a string";

        // get db connection to todo collection
        const todoCollection = await todoItems();

        let newTodo = {
            title: title,
            description: description,
            completed: false,
            completedAt: null
        };

        // perform insert
        const insertInfo = await todoCollection.insertOne(newTodo);
        if (insertInfo.insertedCount === 0) throw "Could not add task";

        return await this.getTask(insertInfo.insertedId.toString());
    },

    async getAllTasks() {
        // return all the todoItems
        const todoCollection = await todoItems();
        return await todoCollection.find({}).toArray();
    },

    async getTask(id) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if(typeof(id) != 'string') throw "id should be a string";

        // get db connection to todo collection
        const todoCollection = await todoItems();

        // perform search
        const todo = await todoCollection.findOne({ _id: ObjectId(id) });
        if (todo === null) throw "No task with given id";

        return todo;
    },    

    async removeTask(id) {
        // error checking
        if (!id) throw "You must provide an id to search for";
        if(typeof(id) != 'string') throw "id should be a string";

        // get db connection to todo collection
        const todoCollection = await todoItems();
        const taskBeingDeleted = await this.getTask(id);

        // perform delete
        const deletionInfo = await todoCollection.removeOne({ _id: ObjectId(id) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete task with id of ${id}`;
        }

        return true;
    },

    async completeTask(taskId) {
        // error checking
        if (!taskId) throw "You must provide a taskid to search for";
        if(typeof(taskId) != 'string') throw "Taskid should be a string";        

        // get db connection to todo collection
        const todoCollection = await todoItems();

        const t_task = await this.getTask(taskId);
        const updatedTodo = {
          title: t_task.title,
          description: t_task.description,
          completed: true,
          completedAt: new Date()
        };
        
        // perform update
        const updateInfo = await todoCollection.updateOne({ _id: ObjectId(taskId)}, {$set:updatedTodo});
        if (updateInfo.modifiedCount === 0) {
            throw "could not update task successfully";
        }

        return updatedTodo;
    }
};
