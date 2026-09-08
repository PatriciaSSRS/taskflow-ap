const taskService = require('../services/taskService');
const { parseOrThrow } = require('../middleware/validate');
const {
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
} = require('../validation/schemas');
const parseId = require('../utils/parseId');

async function create(req, res, next) {
  try {
    const data = parseOrThrow(createTaskSchema, req.body);
    const task = await taskService.create(req.user.id, data);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const filters = parseOrThrow(taskFilterSchema, req.query);
    const tasks = await taskService.list(req.user.id, filters);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskService.getOwned(req.user.id, parseId(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = parseOrThrow(updateTaskSchema, req.body);
    const task = await taskService.update(
      req.user.id,
      parseId(req.params.id),
      data
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await taskService.remove(req.user.id, parseId(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
