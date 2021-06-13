const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: Number,
    default: Math.floor(Math.random() * 10000) + 1,
  },
  invoiceDate: { type: Date, default: Date.now() },
  items: [
    {
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      Amount: { type: Number },
    },
  ],
  totalPrice: { type: Number },
  bill_to: { name: { type: String }, email: { type: String } },
  bill_status: {
    type: String,
    enum: ['paid', 'outstanding', 'late'],
    default: 'outstanding',
  },
});

invoiceSchema.pre('save', async function (next) {
  this.items.Amount = this.items.price * this.items.quantity;
  console.log(this.items.Amount);
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
