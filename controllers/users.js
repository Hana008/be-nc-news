const selectUser = require('../models/users')

const getUserByUsername = function (req, res, next) {
    const { username } = req.params
    selectUser(username).then(([user]) => {
        res.status(200).send({ user })
    }).catch(next)
};

module.exports = getUserByUsername;