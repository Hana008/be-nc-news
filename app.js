const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const {send405Error} = require('./errors/index');
const {errorHandler} = require('./errors/index');

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', send405Error);

app.use(errorHandler);

module.exports = app;