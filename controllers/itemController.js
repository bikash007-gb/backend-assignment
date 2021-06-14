const Items = require('../models/Items');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../util/errorResponse');
const Invoice = require('../models/Invoice');

// @desc      Add review
// @route     POST /api/v1/invoice/:invoiceId/items
// @access    Private
exports.addItems = asyncHandler(async (req, res, next) => {
  req.body.invoice = req.params.invoiceId;
  const invoice = await Invoice.findById(req.params.invoiceId);
  console.log(req.params);
  if (!invoice) {
    return next(
      new ErrorResponse(
        `No invoice with the id of ${req.params.invoiceId}`,
        404
      )
    );
  }
  if (invoice.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to access this invoice`, 404)
    );
  }
  //items.map((item) => (item.Amount = item.price * item.quantity));
  const items = await Items.create(req.body);

  res.status(201).json({
    status: 'success',
    items,
  });
});

exports.getOneItem = asyncHandler(async (req, res, next) => {
  const item = await Items.findById(req.params.id).populate({
    path: 'invoice',
    select: 'invoiceNumber user totalPrice bill_status',
  });

  if (!item) {
    return next(
      new ErrorResponse(`No item found with the id of ${req.params.id}`, 404)
    );
  }
  //console.log(item.invoice)

  res.status(200).json({
    success: true,
    item,
  });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { name, price, quantity } = req.body;
  let item = await Items.findById(req.params.id).populate({
    path: 'invoice',
    select: 'invoiceNumber user totalPrice bill_status',
  });

  if (!item) {
    return next(
      new ErrorResponse(`No item found with the id of ${req.params.id}`, 404)
    );
  }
  if (item.invoice.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to update this item`, 401));
  }

  item.name = name ? name : item.name;
  item.price = price ? price : item.price;
  item.quantity = quantity ? quantity : item.quantity;
  await item.save();
  res.status(200).json({
    status: 'success',
    item,
  });
});

exports.delete = asyncHandler(async (req, res, next) => {
  const item = await Items.findById(req.params.id).populate({
    path: 'invoice',
    select: 'invoiceNumber user ',
  });
  if (!item) {
    return next(
      new ErrorResponse(`No item found with the id of ${req.params.id}`, 404)
    );
  }
  console.log(item);
  if (item.invoice.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`Not authorized to delete this item`, 401));
  }
  await item.remove();
  res.status(200).json({
    status: 'success',
  });
});
