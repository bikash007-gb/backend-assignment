const express = require('express');
const itemController = require('../controllers/itemController');
const auth = require('../middlewares/auth');
const router = express.Router({ mergeParams: true });

router.route('/').post(auth.protect, itemController.addItems);
router
  .route('/:id')
  .get(auth.protect, itemController.getOneItem)
  .put(auth.protect, itemController.update)
  .delete(auth.protect, itemController.delete);
module.exports = router;
