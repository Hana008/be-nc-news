const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById, postComment, getComments } = require('../controllers/articles')

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);
articlesRouter.post('/:article_id/comments', postComment);
articlesRouter.get('/:article_id/comments', getComments);

module.exports = articlesRouter;