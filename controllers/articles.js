const { selectArticleById, updateArticle, insertComment } = require('../models/articles')

const getArticleById = function (req, res, next) {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article })
    })
};

const patchArticleById = function (req, res, next) {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticle(inc_votes, article_id, selectArticleById).then((article) => {
        res.status(201).send({ article })
    })
};

const postComment = function (req, res, next) {
    const { article_id } = req.params;
    const body = req.body;
    insertComment(article_id, body).then((comment) =>{
        res.status(201).send({comment})
    })
};

module.exports = { getArticleById, patchArticleById, postComment }