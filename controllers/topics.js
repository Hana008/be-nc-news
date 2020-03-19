const selectTopics = require('../models/topics');

const getTopics = function (req, res, next) {
selectTopics().then((topics)=> {
res.status(200).send({topics})
    }).catch(next)
};

module.exports = getTopics