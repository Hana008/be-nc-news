const connection = require('../db/connection')

const selectUser = function (username) {
    return connection('users')
        .where('username', username)
        .then((user) => {
            if(user.length === 0) {
                return Promise.reject({msg: 'column not found!'})
            }
            return user
        })
};

module.exports = selectUser;