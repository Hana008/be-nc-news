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
    return selectArticleById(article_id).then((article) => {
        article[0].votes += voteNum
        return article
    })
};

const insertComment = function(article_id, body) {
  
};

module.exports = { selectArticleById, updateArticle , insertComment};