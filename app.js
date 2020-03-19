const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter')

app.use(express.json())

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
   res.status(400).send({msg: 'internal error!'})
})

module.exports = app;