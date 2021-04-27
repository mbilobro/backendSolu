const dateFormat = require('dateformat')

module.exports =  {
    render(post) {
        return {
            id: post.id,
            category: post.category,
            user_id: post.user_id,
            title: post.title,
            body: post.body,
            header_image: post.header_image,
            likes: post.likes,
            description: post.description,
            image_alt: post.image_alt,
            created_at: dateFormat(post.created_at, "dd/mm/yyyy hh:mm:ss"),
        };
    },

    renderMany(posts) {
        return posts.map(post => this.render(post));
    },    
};