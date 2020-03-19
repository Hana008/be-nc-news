const connection = require('../db/connection');

const updateComment = function (comment_id, voteNum) {
    return connection('comments')
        .where('comment_id', comment_id)
        .increment('votes', voteNum)
        .returning('*');
};
const deleteComment = function (comment_id) {
    return connection('comments')
        .where('comments.comment_id', comment_id)
        .del()
};

module.exports = { updateComment, deleteComment };