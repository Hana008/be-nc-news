const { updateComment, deleteComment } = require('../models/comments')

const patchComment = function (req, res, next) {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateComment(comment_id, inc_votes)
        .then(([comment]) => {
            res.status(200).send({ comment })
        }).catch(next)
};

const removeComment = function (req, res, next) {
    const { comment_id } = req.params;
    deleteComment(comment_id).then(() => {
        res.sendStatus(204)
    }).catch(next)
};

module.exports = { patchComment, removeComment };