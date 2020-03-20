const connection = require('../db/connection');

const checkExists = function (table, column, query) {
    if (!query) return true;
    return connection(table)
        .select()
        .where({ [column]: query })
        .first()
};

const selectAllArticles = function (sort_by, order, author, topic) {
    //theres always going to be a default order of descending and sorted by created_at
    //then modify
    //then use checkExists function

    return connection
        .select('articles.*')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .count({ comment_count: 'comment_id' })
        .orderBy(sort_by || 'created_at', order || 'desc')
        .modify((query) => {
            if (author && !topic) {
                query
                    .where('articles.author', author)
            }
        }).modify((query) => {
            if (topic && !author) {
                query
                    .where('articles.topic', topic)
            }
        })
        .then((queriedData) => {
            if (!queriedData.length && author) {
                return Promise.all([checkExists('users', 'username', author), queriedData])
            } else if (!queriedData.length && topic) {
                return Promise.all([checkExists('topics', 'slug', topic), queriedData])
            }
            else {
                return [true, queriedData]
            }
        })
        .then(([articleExists, queriedData]) => {
            if (articleExists) {
                return queriedData
            } else {
                return Promise.reject({ msg: 'column not found!' })
            }
        })
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

    return connection('articles').where('article_id', article_id).increment('votes', voteNum || 0).returning('*');
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
    // if (!sort_by && !order) {
    //     return connection('comments').where('article_id', article_id).orderBy('created_at', 'desc').returning('*');
    // } else if (sort_by && order) {
    //     return connection('comments').orderBy(sort_by, order).returning('*');
    // } else if (sort_by && !order) {
    //     return connection('comments').orderBy(sort_by, 'desc').returning('*');
    // } else if (order && !sort_by) {
    //     return connection('comments').orderBy('created_at', order).returning('*');
    // }

    return connection('comments').where('article_id', article_id).orderBy(sort_by || 'created_at', order || 'desc')
        .then((commentData) => {
            if (!commentData.length) {
                return Promise.all([checkExists('comments', 'article_id', article_id), commentData])
            }
            else {
                return [true, commentData]
            }
        })
        .then(([articleExists, commentData]) => {
            if (articleExists) {
                return commentData
            } else {
                return Promise.reject({ msg: 'id does not exist!' })
            }
        })
};

module.exports = { selectAllArticles, selectArticleById, updateArticle, insertComment, selectComments };