var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: 'downloadable',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true
        },
        body: { type: 'text' },
        title: { type: 'varchar' },
        image_name: { type: 'varchar' },
        content_name: { type: 'varchar' }
    }
})
