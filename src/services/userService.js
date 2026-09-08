const userRepository = require('../repositories/userRepository');
const HttpError = require('../utils/httpError');

async function getById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }
  return user;
}

async function update(currentUserId, targetId, data) {
  if (currentUserId !== targetId) {
    throw new HttpError(403, 'You can only modify your own account');
  }
  const updated = await userRepository.update(targetId, data);
  if (!updated) {
    throw new HttpError(404, 'User not found');
  }
  return updated;
}

async function remove(currentUserId, targetId) {
  if (currentUserId !== targetId) {
    throw new HttpError(403, 'You can only delete your own account');
  }
  const ok = await userRepository.remove(targetId);
  if (!ok) {
    throw new HttpError(404, 'User not found');
  }
}

module.exports = { getById, update, remove };
