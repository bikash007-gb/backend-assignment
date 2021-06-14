const express = require('express');

const invoiceController = require('../controllers/invoiceController');
const auth = require('../middlewares/auth');
const itemsRoute = require('./itemRoute');

const router = express.Router();

router.use('/:invoiceId/items', itemsRoute);
router
  .route('/')
  .post(auth.protect, invoiceController.createInvoice)
  .get(auth.protect, invoiceController.getInvoice);
router
  .route('/:id')
  .get(auth.protect, invoiceController.getOneInvoice)
  .put(auth.protect, invoiceController.update);
module.exports = router;
