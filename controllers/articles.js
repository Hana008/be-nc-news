const { selectArticleById, updateArticle, insertComment, selectComments } = require('../models/articles')

const getArticleById = function (req, res, next) {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    }).catch(next)
};

const patchArticleById = function (req, res, next) {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticle(inc_votes, article_id, selectArticleById).then((article) => {
        res.status(201).send({ article });
    }).catch(next)
};

const postComment = function (req, res, next) {
    const { article_id } = req.params;
    const body = req.body;
    insertComment(article_id, body).then((comment) => {
        res.status(201).send({ comment });
    }).catch(next)
};

const getComments = function (req, res, next) {
    const { article_id } = req.params;
    const { order } = req.query
    const { sort_by } = req.query;
    selectComments(article_id, sort_by, order).then((comments) => {
        res.status(200).send({ comments });
    }).catch(next)
}

module.exports = { getArticleById, patchArticleById, postComment, getComments }