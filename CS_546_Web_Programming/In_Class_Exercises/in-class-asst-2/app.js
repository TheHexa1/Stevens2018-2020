const todo = require("./todo");
const connection = require("./config/mongoConnection");

const main = async () => {
  
  const task1 = await todo.createTask("Ponder Dinosaurs", "Has Anyone Really Been Far Even as Decided to Use Even Go Want to do Look More Like?");
  console.log(task1);

  const task2 = await todo.createTask("Play Pokemon with Twitch TV", "Should we revive Helix?");

  const all_tasks = await todo.getAllTasks();
  console.log(all_tasks);

  const result = await todo.removeTask(all_tasks[0]._id.toString())

  const remaining_tasks = await todo.getAllTasks();
  console.log(remaining_tasks);

  const completed_task = await todo.completeTask(remaining_tasks[0]._id.toString())
  console.log(completed_task);

  const db = await connection();
  await db.serverConfig.close();

  console.log("Completed!");
};

main().catch(error => {
  console.log(error);
});
