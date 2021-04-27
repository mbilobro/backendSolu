const userView = require('./user_view')
const postView = require('./posts_view')
const dateFormat = require('dateformat')
const moment = require('moment')

module.exports =  {
    render(like) {
        return {
            id: like.id,
            post_id: like.post_id,
            user_id: like.user_id,
            created_at: moment(like.created_at).format("DD/MM/YYYY hh:mm:ss"),
            // user: userView.render(like.user),
            // post: postView.render(like.post)
        };
    },

    renderMany(likes) {
        return likes.map(like => this.render(like));
    },
    
};