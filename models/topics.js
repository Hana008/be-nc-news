const connection = require('../db/connection');

const selectTopics = function() {
return connection.select('*').from('topics').returning('*')
};

module.exports = selectTopics