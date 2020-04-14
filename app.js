const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter');
const { errorHandler } = require('./errors/index');
const { send404Error } = require('./errors/index');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);
app.all('/*', send404Error);

app.use(errorHandler);

module.exports = app;