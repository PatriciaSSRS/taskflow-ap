const { Router } = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/me', userController.me);
router.get('/:id', userController.getOne);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
