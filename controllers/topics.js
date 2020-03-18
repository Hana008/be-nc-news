const selectTopics = require('../models/topics');

const getTopics = function (req, res, next) {
selectTopics().then((topics)=> {
res.status(200).send({topics})
    })
};

module.exports = getTopics