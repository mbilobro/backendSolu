var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Comment",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        post_id: {
            type: 'int'
        },
        // user_id: {
        //     type: 'int'
        // },
        body: {
            type: 'mediumtext'
        },
        created_at: {
            type: 'datetime',
        },
    },
    relations: {
        user: {
            type: 'one-to-one',
            target: 'User',
            joinColumn: {name: 'user_id', referencedColumnName: 'id'},              
        },
        post: {
            type: 'one-to-one',
            target: 'Post',
            joinColumn: {name: 'post_id', referencedColumnName: 'id'},              
        },
    },
})
