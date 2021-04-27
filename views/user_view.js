const dateFormat = require('dateformat')

module.exports =  {
    render(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            // password: user.password,
            avatar: user.avatar,
            admin: user.admin,
            created_at: dateFormat(user.created_at, "dd/mm/yyyy hh:mm:ss"),
        };
    },

    renderMany(users) {
        return users.map(user => this.render(user));
    },
    
};