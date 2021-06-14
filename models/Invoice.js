const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      default: Math.floor(Math.random() * 10000) + 1,
    },
    invoiceDate: { type: Date, default: Date.now() },
    totalPrice: { type: Number },
    bill_to: { name: { type: String }, email: { type: String } },
    bill_status: {
      type: String,
      enum: ['paid', 'outstanding', 'late'],
      default: 'outstanding',
    },
    notes: { type: String },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

invoiceSchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'invoice',
  justOne: false,
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
