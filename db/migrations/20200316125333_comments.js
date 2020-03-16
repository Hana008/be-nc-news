
exports.up = function(knex) {
  console.log('creating comments table...');

  return knex.schema.createTable(('comments'), function(commentsTable) {
      commentsTable.increments('comment_id').primary();
      commentsTable.string('author').references('users.username');
      commentsTable.integer('article_id').references('articles.article_id');
      commentsTable.integer('votes').defaultTo(0);
      commentsTable.timestamps(true, true);
      commentsTable.text('body')
  })
};

exports.down = function(knex) {
  console.log('dropping comments table...');

  return knex.schema.dropTable('comments')
};
