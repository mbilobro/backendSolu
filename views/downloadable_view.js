
module.exports =  {
    render(downloadable) {
        return {
            id: downloadable.id,
            body: downloadable.body,
            title: downloadable.title,
            image_name: downloadable.image_name,
            content_name: downloadable.content_name
        }
    },

    renderMany(downloadables) {
        return downloadables.map(downloadble => this.render(downloadble))
    }    
}