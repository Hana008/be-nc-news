const commentsRouter = require('express').Router();
const { patchComment, removeComment } = require('../controllers/comments');
const { send405Error } = require('../errors/index');

commentsRouter.patch('/:comment_id', patchComment);
commentsRouter.delete('/:comment_id', removeComment);
commentsRouter.put('/:comment_id', send405Error)

module.exports = commentsRouter;