
exports.up = function (knex) {


    return knex.schema.createTable(
        'users', function (usersTable) {
            usersTable.string('username').primary().notNullable().unique();
            usersTable.string('avatar_url').notNullable().unique();
            usersTable.string('name').notNullable();
        }
    )

};

exports.down = function (knex) {
    
    return knex.schema.dropTable('users')
};
