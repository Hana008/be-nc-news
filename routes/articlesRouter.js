const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById, postComment, getComments } = require('../controllers/articles')
const {send405Error} = require('../errors/index')

articlesRouter.get('/', getAllArticles)
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);
articlesRouter.post('/:article_id/comments', postComment);
articlesRouter.get('/:article_id/comments', getComments);
articlesRouter.patch('/', send405Error);
articlesRouter.put('/:article_id', send405Error)
articlesRouter.put('/:article_id/comments', send405Error)

module.exports = articlesRouter;