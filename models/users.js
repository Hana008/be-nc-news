const connection = require('../db/connection')

const selectUser = function (username) {
    return connection('users')
        .where('username', username)
        .then((user) => {
            return { user }
        })
};

module.exports = selectUser;