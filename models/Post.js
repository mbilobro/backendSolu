var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "Post",
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        category: {
            type: 'varchar'
        },
        user_id: {
            type: 'int'
        },
        title: {
            type: 'varchar'
        },
        body: {
            type: 'text'
        },
        header_image: {
            type: 'varchar'
        },
        created_at: {
            type: 'datetime',
        },
        likes: {
            type: 'int'
        },
        description: {
            type: 'varchar'
        },
        image_alt: {
            type: 'varchar'
        },
        slug: {
            type: 'varchar'
        },
    },
    // relations: {
    //     post_category: {
    //         target: "Category",
    //         // column: 'category',
    //         type: "many-to-one",
    //         // joinTable: true,
    //         cascade: true
    //     }
    // }
})
