const Category = require('../models/Category')
const dateFormat = require('dateformat')

module.exports =  {
    render(category) {
        return {
            category: category.category,            
        };
    },

    renderMany(categories) {
        return categories.map(category => this.render(category));
    }
};