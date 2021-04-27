var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "User",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        email: {
            type: 'varchar'
        },
        name: {
            type: 'varchar'
        },
        password: {
            type: 'varchar'
        },
        avatar: {
            type: 'varchar'
        },
        created_at: {
            type: 'datetime',
        },
        admin: {
            type: 'tinyint',
        }       
    },
})
