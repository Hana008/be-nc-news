const connection = require('../db/connection');

const selectArticleById = function (article_id) {
    return connection('articles').where('article_id', article_id).then((article) => {
        const articleData = article;
        const comment = connection('comments').where('author', articleData[0].author);
        return Promise.all([articleData, comment])
    }).then(([article, comment]) => {
        article[0].comment_count = comment.length;
        return article
    })
};

const updateArticle = function (voteNum, article_id, selectArticleById) {
    return connection('articles').where('article_id', article_id).increment('votes', voteNum).returning('*');
};

const insertComment = function (article_id, body) {
    const comment = {
        'article_id': article_id,
        'author': body.username,
        'body': body.body
    };
    return connection('comments').where('author', body.username).insert(comment).returning('*');
};

const selectComments = function (article_id) {
    return connection('comments').where('article_id', article_id).returning('*');
};

module.exports = { selectArticleById, updateArticle, insertComment, selectComments };