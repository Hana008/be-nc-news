const connection = require('../db/connection')

const selectUser = (username) => {

    return connection('users')
        .where('username', username)
        .then((user) => {
            if (user.length === 0) {
                return Promise.reject({ status: 404, msg: { msg: 'column not found!' } })
            }
            return user
        });
};

module.exports = selectUser;