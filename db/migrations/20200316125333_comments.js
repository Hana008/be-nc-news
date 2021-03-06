
exports.up = function (knex) {

  return knex.schema.createTable(('comments'), function (commentsTable) {
    commentsTable.increments('comment_id').primary().notNullable();
    commentsTable.string('author').references('users.username').notNullable();
    commentsTable.integer('article_id').references('articles.article_id').notNullable().onDelete('CASCADE');
    commentsTable.integer('votes').defaultTo(0).notNullable();
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    commentsTable.text('body').notNullable()
  })
};

exports.down = function (knex) {

  return knex.schema.dropTable('comments')
};
