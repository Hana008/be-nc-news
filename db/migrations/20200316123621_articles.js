
exports.up = function(knex) {
    console.log('creating articles table...');

    return knex.schema.createTable('articles', function(articlesTable) {
        articlesTable.increments('article_id').primary();
        articlesTable.string('title');
        articlesTable.text('body');
        articlesTable.integer('votes').defaultTo(0);
        articlesTable.string('topic').references('topics.slug');
        articlesTable.string('author').references('users.username');
        articlesTable.timestamps(true, true)
    })
  
};

exports.down = function(knex) {
  console.log('dropping articles table...');

  return knex.schema.dropTable('articles')
};
