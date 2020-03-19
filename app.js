const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter')

app.use(express.json())

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
   
    res.status(404).send(err)
   
})

module.exports = app;