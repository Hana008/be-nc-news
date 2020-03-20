const express = require('express');
const app = express();
const apiRouter = require('./routes/apiRouter')

app.use(express.json())

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    // console.log('ERROR HANDLING!!!')
    // console.log(err)
    const errCodes = {
        '23502': { status: 404, msg: { msg: 'missing information!' } },
        '22P02': { status: 400, msg: { msg: 'invalid id!' } }
    }
    if (Object.keys(errCodes).includes(err.code)) {
        res.status(errCodes[err.code].status).send(errCodes[err.code].msg)
    }
    else { res.status(404).send(err) }

})

module.exports = app;