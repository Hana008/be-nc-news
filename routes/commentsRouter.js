const commentsRouter = require('express').Router();
const { patchComment, removeComment } = require('../controllers/comments');

commentsRouter.patch('/:comment_id', patchComment);
commentsRouter.delete('/:comment_id', removeComment)

module.exports = commentsRouter;