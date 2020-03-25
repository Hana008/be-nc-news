const connection = require('../db/connection');

const checkExists = function (table, column, query) {
    if (!query) return true;
    return connection(table)
        .select()
        .where({ [column]: query })
        .first()
};

const selectAllArticles = function (sort_by, order, author, topic) {

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
                return Promise.reject({ status: 404, msg: { msg: 'column not found!' } })
            }
        });

};


const selectArticleById = function (article_id) {

    return connection
        .select('articles.*')
        .from('articles')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .groupBy('articles.article_id')
        .count({ comment_count: 'comment_id' })
        .where('articles.article_id', article_id)
        .then((articleData) => {
            if (articleData.length === 0) {
                return Promise.all([checkExists('articles', 'article_id', article_id), articleData])
            } else {
                return [true, articleData]
            }
        })
        .then(([articleExists, articleData]) => {
            if (articleExists) {
                return articleData
            } else {
                return Promise.reject({ status: 404, msg: { msg: 'article id does not exist!' } })
            }
        });

};

const updateArticle = function (voteNum, article_id, selectArticleById) {

    return connection('articles').where('article_id', article_id).increment('votes', voteNum || 0).returning('*');

};

const insertComment = function (article_id, body) {

    if (body.body && body.username) {

        return Promise.all([checkExists('articles', 'article_id', article_id)])
            .then(([articleExists]) => {
                if(articleExists) {

                    const comment = {
                        'article_id': article_id,
                        'author': body.username,
                        'body': body.body
                    };
                    return connection('comments').where('author', body.username).insert(comment).returning('*')
                } else {
                    return Promise.reject({status: 404, msg: {msg: 'article id does not exist!'}})
                }
            })
    }
    else {
        return Promise.reject({ status: 400, msg: { msg: 'missing information!' } })
    }
};

const selectComments = function (article_id, sort_by, order) {

    return connection('comments').where('article_id', article_id).orderBy(sort_by || 'created_at', order || 'desc')
        .then((commentData) => {
            if (commentData.length === 0) {
                return Promise.all([checkExists('articles', 'article_id', article_id), commentData])
            }
            else {
                return [true, commentData]
            }
        })
        .then(([articleExists, commentData]) => {
            if (articleExists) {
                return commentData
            } else {
                return Promise.reject({ status: 404, msg: { msg: 'id does not exist!' } })
            }
        });

};

module.exports = { selectAllArticles, selectArticleById, updateArticle, insertComment, selectComments };