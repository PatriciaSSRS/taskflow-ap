const { Router } = require('express');
const taskController = require('../controllers/taskController');
const authenticate = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/', taskController.list);
router.post('/', taskController.create);
router.get('/:id', taskController.getOne);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.remove);

module.exports = router;
