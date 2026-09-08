const userService = require('../services/userService');
const { parseOrThrow } = require('../middleware/validate');
const { updateUserSchema } = require('../validation/schemas');
const parseId = require('../utils/parseId');

async function me(req, res, next) {
  try {
    const user = await userService.getById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const user = await userService.getById(parseId(req.params.id));
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = parseOrThrow(updateUserSchema, req.body);
    const user = await userService.update(
      req.user.id,
      parseId(req.params.id),
      data
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await userService.remove(req.user.id, parseId(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { me, getOne, update, remove };
