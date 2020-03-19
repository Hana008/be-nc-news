const topicsRouter = require('express').Router();
const getTopics = require('../controllers/topics');
const {send405Error} = require('../errors/index');

topicsRouter.get('/', getTopics);
topicsRouter.patch('/', send405Error)

module.exports  = topicsRouter;