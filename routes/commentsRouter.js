const commentsRouter = require('express').Router();
const { patchComment, removeComment } = require('../controllers/comments');
const { send405Error } = require('../errors/index');

commentsRouter.route('/:comment_id').patch(patchComment).delete(removeComment).put(send405Error);

module.exports = commentsRouter;