const taskRepository = require('../repositories/taskRepository');
const HttpError = require('../utils/httpError');

function create(userId, data) {
  return taskRepository.create({ ...data, userId });
}

function list(userId, filters) {
  return taskRepository.listByUser(userId, filters);
}

async function getOwned(userId, taskId) {
  const task = await taskRepository.findById(taskId);
  if (!task || task.user_id !== userId) {
    // Do not leak existence of tasks that belong to other users.
    throw new HttpError(404, 'Task not found');
  }
  return task;
}

async function update(userId, taskId, data) {
  await getOwned(userId, taskId);
  return taskRepository.update(taskId, data);
}

async function remove(userId, taskId) {
  await getOwned(userId, taskId);
  await taskRepository.remove(taskId);
}

module.exports = { create, list, getOwned, update, remove };
