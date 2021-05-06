var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
    name: "ConfigPS",
    columns: {
        view: {
            primary: true,
            type: 'tinyint',
            default: 0
        }      
    },
})
