var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Likes",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        post_id: {
            type: 'int'
        },
        user_id: {
            type: 'int'
        },      
        created_at: {
            type: 'timestamp',
        },
    },
    relations: {
        user: {
            type: 'one-to-many',
            target: 'User',
            joinColumn: {name: 'user_id', referencedColumnName: 'id'},              
        },
        post: {
            type: 'one-to-many',
            target: 'Post',
            joinColumn: {name: 'post_id', referencedColumnName: 'id'},              
        },
    },
})
