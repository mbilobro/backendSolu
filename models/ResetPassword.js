var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: 'reset_password',
    columns: {
        user_id: {
            primary: true,
            type: 'int',
        },
        token: { 
            type: 'varchar' 
        },
        expiresIn: { 
            type: 'varchar' 
        }
    },
    relations: {
        user: {
            target: 'User',
            type: 'one-to-one',
            joinColumn: {
                name: 'user_id',
                referencedColumnName: 'id'
            }
        }
    }
})
