var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "post_category",
    columns: {
        category: {
            primary: true,
            type: 'varchar',
        },        
    },
    // relations: {
    //     posts: {
    //         target: "Post",
    //         type: "one-to-many",
    //         joinTable: true,
    //         cascade: true
    //     }
    // }
})
