const connection = require('../db/connection');

const selectAllArticles = function (sort_by, order, author, topic) {
    if (!sort_by && !order && !author && !topic) {
        return connection
            .select('articles.*')
            .from('articles')
            .leftJoin('comments', 'articles.article_id', 'comments.article_id')
            .groupBy('articles.article_id')
            .count({ comment_count: 'comment_id' })
            .orderBy('created_at', 'desc')

    } else if (sort_by && order && !author && !topic) {
        return connection
            .select('articles.*')
            .from('articles')
            .leftJoin('comments', 'articles.article_id', 'comments.article_id')
            .groupBy('articles.article_id')
            .count({ comment_count: 'comment_id' })
            .orderBy(sort_by, order)
    } else if (sort_by && !order && !author && !topic) {
        return connection
            .select('articles.*')
            .from('articles')
            .leftJoin('comments', 'articles.article_id', 'comments.article_id')
            .groupBy('articles.article_id')
            .count({ comment_count: 'comment_id' })
            .orderBy(sort_by, 'desc')
    } else if (author && !sort_by && !order && !topic) {
        return connection
            .select('articles.*')
            .from('articles')
            .leftJoin('comments', 'articles.article_id', 'comments.article_id')
            .groupBy('articles.article_id')
            .count({ comment_count: 'comment_id' })
            .where('articles.author', author)
    } else if (topic && !sort_by && !order && !author) {
        return connection
            .select('articles.*')
            .from('articles')
            .leftJoin('comments', 'articles.article_id', 'comments.article_id')
            .groupBy('articles.article_id')
            .count({ comment_count: 'comment_id' })
            .where('articles.topic', topic)
    }
};

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

const selectComments = function (article_id, sort_by, order) {
    if (sort_by === undefined) {
        return connection('comments').where('article_id', article_id).orderBy('created_at', 'desc').returning('*');
    } else if (sort_by && order) {
        return connection('comments').orderBy(sort_by, order).returning('*');
    } else if (sort_by && !order) {
        return connection('comments').orderBy(sort_by, 'desc').returning('*');

    }
};

module.exports = { selectAllArticles, selectArticleById, updateArticle, insertComment, selectComments };