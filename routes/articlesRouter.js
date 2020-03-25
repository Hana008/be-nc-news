const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById, patchArticleById, postComment, getComments } = require('../controllers/articles')
const {send405Error} = require('../errors/index')

articlesRouter.route('/').get(getAllArticles).patch(send405Error);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById).all(send405Error);
articlesRouter.route('/:article_id/comments').post(postComment).get(getComments).all(send405Error);

module.exports = articlesRouter;