const express = require('express');

const invoiceRoute = require('./routes/invoiceRoute');
const error = require('./middlewares/error');
const app = express();
app.use(express.json());

app.use('/api/v1/invoice', invoiceRoute);
app.use(error);
module.exports = app;
