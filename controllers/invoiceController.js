const Invoice = require('../models/Invoice');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../util/errorResponse');

exports.createInvoice = asyncHandler(async (req, res, next) => {
  const { bill_to, items } = req.body;
  let total;
  items.map((item) => (item.Amount = item.price * item.quantity));
  console.log(total);
  const invoice = await Invoice.create({ items, ...req.body });
  res.status(201).json({
    status: 'success',
    invoice,
  });
});

exports.update = asyncHandler(async (req, res, next) => {
  const { items } = req.body;
  items.map((item) => (item.Amount = item.price * item.quantity));
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    { items, ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!invoice) {
    return next(new ErrorResponse('No document found', 404));
  }
  res.status(200).json({
    status: 'success',
    invoice,
  });
});
