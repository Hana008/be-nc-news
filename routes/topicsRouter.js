const topicsRouter = require('express').Router();
const getTopics = require('../controllers/topics');
const {send405Error} = require('../errors/index');

topicsRouter.route('/').get(getTopics).patch(send405Error);

module.exports  = topicsRouter;