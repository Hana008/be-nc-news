const usersRouter = require('express').Router();
const getUserByUsername = require('../controllers/users');
const { send405Error } = require('../errors/index')

usersRouter.get('/:username', getUserByUsername);
usersRouter.put('/:username', send405Error);

module.exports = usersRouter;