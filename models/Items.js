const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  Amount: { type: Number },
  invoice: { type: mongoose.Schema.ObjectId, ref: 'Invoice', required: true },
});

itemSchema.statics.gettotalPrice = async function (invoiceId) {
  const obj = await this.aggregate([
    {
      $match: { invoice: invoiceId },
    },
    {
      $group: {
        _id: '$invoice',
        totalPrice: { $sum: '$Amount' },
      },
    },
  ]);

  try {
    //console.log(obj);
    await this.model('Invoice').findByIdAndUpdate(invoiceId, {
      totalPrice: obj[0].totalPrice,
    });
  } catch (err) {
    console.error(err);
  }
};

itemSchema.pre('save', function (next) {
  //console.log(req.params);
  this.Amount = this.price * this.quantity;
  next();
});

itemSchema.post('save', function () {
  //console.log('ff');
  this.constructor.gettotalPrice(this.invoice?._id);
});
itemSchema.pre('remove', function () {
  this.constructor.gettotalPrice(this.invoice?._id);
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
