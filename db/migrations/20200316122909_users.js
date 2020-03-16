
exports.up = function (knex) {
    console.log('creating users table...');

    return knex.schema.createTable(
        'users', function (usersTable) {
            usersTable.string('username').primary().notNullable();
            usersTable.string('avatar_url');
            usersTable.string('name');
        }
    )

};

exports.down = function (knex) {
    console.log('dropping users table...');
    
    return knex.schema.dropTable('users')
};
