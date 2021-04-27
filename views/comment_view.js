const userView = require('./user_view')
const postView = require('./posts_view')
const dateFormat = require('dateformat')

module.exports =  {
    render(comment) {
        return {
            id: comment.id,
            post_id: comment.post_id,
            user_id: comment.user_id,
            body: comment.body,
            created_at: dateFormat(comment.created_at, "dd/mm/yyyy hh:mm:ss"),
            user: userView.render(comment.user),
            post: postView.render(comment.post)
        };
    },

    renderMany(comments) {
        return comments.map(comment => this.render(comment));
    },
    
};