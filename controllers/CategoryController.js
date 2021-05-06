const { getRepository } = require("typeorm");
const Category = require('../models/Category')
const CategoryView = require('../views/category_view')

const uploadFile = require('../config/fileUploadMiddleware');
const Yup = require('yup')
const moment = require('moment')


module.exports = {

    async index(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const CategoryRepository = getRepository(Category);

        const categories = await CategoryRepository.find();
        console.log(categories)
        return res.json(CategoryView.renderMany(categories));
    },
 

    async create(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const {
            category
        } = req.body

        categoryData = {
            category            
        }     

        console.log(req.body)

        const CategoryRepository = getRepository(Category);

        const categoryDB = CategoryRepository.create(categoryData);

        await CategoryRepository.save(categoryDB);

        return res.status(201).json(categoryDB);
    },
};