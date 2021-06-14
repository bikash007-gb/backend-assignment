const Invoice = require('../models/Invoice');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../util/errorResponse');

exports.createInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.create({ user: req.user.id, ...req.body });
  res.status(201).json({
    status: 'success',
    invoice,
  });
});

exports.update = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!invoice) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  if (invoice.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to update this invoice`, 404)
    );
  }
  res.status(200).json({
    status: 'success',
    invoice,
  });
});

exports.getInvoice = asyncHandler(async (req, res, next) => {
  let query;
  //get the query string
  const reqQuery = { ...req.query };
  let queryStr = JSON.stringify(reqQuery);

  query = Invoice.find(JSON.parse(queryStr));

  const result = await query
    .populate({ path: 'user', select: 'name' })
    .populate('items');

  res.status(200).json({
    status: 'success',
    total: result.length,
    result,
  });
});

exports.getOneInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('items')
    .populate({ path: 'user', select: 'name' });

  if (!invoice) {
    return next(
      new ErrorResponse(`No document found with ${req.params.id}`, 404)
    );
  }
  console.log(invoice.user);
  if (invoice.user.id.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to access this invoice`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    invoice,
  });
});
