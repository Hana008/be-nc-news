const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = (knex) => {

  return knex.migrate.rollback()
    .then(() => {
      return knex.migrate.latest()
    })
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData).returning('*');
      const usersInsertions = knex('users').insert(userData).returning('*');
      return Promise.all([topicsInsertions, usersInsertions])
    })
    .then(() => {
      const formattedDates = formatDates(articleData)
      return knex('articles').insert(formattedDates).returning('*')
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef, formatDates);
      return knex('comments').insert(formattedComments);
    });
};
