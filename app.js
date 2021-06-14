const express = require('express');
const cookieparser = require('cookie-parser');

const invoiceRoute = require('./routes/invoiceRoute');
const authRoute = require('./routes/authRoute');
const itemRoute = require('./routes/itemRoute');

const error = require('./middlewares/error');
const app = express();
app.use(express.json());

app.use(cookieparser());

app.use('/api/v1/invoice', invoiceRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/items', itemRoute);
app.use(error);
module.exports = app;
