const express = require('express');
const paymentRoutes = require('./routes/payments.routes.js');
const morgan = require('morgan');
const { PORT } = require('./config.js');
const path = require('path');

const app = express();

app.use(morgan("dev"));

app.use(paymentRoutes);

app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT);
console.log('Server on port ', PORT);