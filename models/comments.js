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
                    .increment('votes', voteNum)
                    .returning('*');
            }
        })
        .then((commentData) => {
            if (!commentData.length) {
                return Promise.all([checkExists('comments', 'comment_id', comment_id), commentData])
            } else {
                return [true, commentData]
            }
        })
        .then(([ifExists, commentData]) => {
            if (ifExists) {
                return commentData
            } else {
                return Promise.reject({ msg: 'id does not exist!' })
            }
        })
};
const deleteComment = function (comment_id) {
    return checkExists('comments', 'comment_id', comment_id)
        .then((ifExists) => {
            if (ifExists) {
                return connection('comments')
                    .where('comments.comment_id', comment_id)
                    .del()
            } else {
                return Promise.reject({ msg: 'id does not exist!' })

            }
        })
};

module.exports = { updateComment, deleteComment };