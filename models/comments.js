const connection = require('../db/connection');

const checkExists = function (table, column, query) {
    if (!query) return true;
    return connection(table)
        .select()
        .where({ [column]: query })
        .first()
};

const updateComment = function (comment_id, voteNum) {
    return connection('comments')
        .where('comment_id', comment_id)
        .modify((query) => {
            if (voteNum) {
                return query
                    .where('comment_id', comment_id)
                    .increment('votes', voteNum)
                    .returning('*');
            }
        })
        .then((commentData) => {
            if (!commentData.length) {
                return Promise.all([checkExists('comments', 'comment_id', comment_id), commentData])
            }
        })
        .then(([ifExists, commentData]) => {
            if (ifExists) {
                return commentData
            } else {
                return Promise.reject({msg: 'id does not exist!'})
            }
        })


};
const deleteComment = function (comment_id) {
    return connection('comments')
        .where('comments.comment_id', comment_id)
        .del()
};

module.exports = { updateComment, deleteComment };