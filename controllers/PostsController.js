const { getRepository, Like } = require("typeorm");
const Post = require('../models/Post')
const PostView = require('../views/posts_view')

const uploadFile = require('../config/fileUploadMiddleware');
const Yup = require('yup')
const moment = require('moment')


module.exports = {

    async index(req, res) {
        const { filter='' } = req.query

        const postsRepository = getRepository(Post);

        const posts = await postsRepository.find({
            where: [
                {body: Like(`%${filter}%`)},
                {title: Like(`%${filter}%`)},
                {category: Like(`%${filter}%`)},
                {description: Like(`%${filter}%`)}
            ],
            order: { created_at: "DESC" },
        });

        return res.json(PostView.renderMany(posts));
    },

    async count(req, res) {
        const postsRepository = getRepository(Post);

        const postCount = await postsRepository.count()

        return res.json(postCount)
    },

    async get(req, res) {
        const { id } = req.params;

        const postsRepository = getRepository(Post);

        const post = await postsRepository.findOne(id)

        return (post? res.json(PostView.render(post)) : res.json([]));
    },

    async create(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        try {
            await uploadFile(req, res)
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).send({ message: "Please upload a file!" });
            }

        } catch (err) {
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            });
        }

        const {
            category,
            user_id,
            title,
            body,
            header_image,
            likes,
            description,
            image_alt,
        } = req.body

        postData = {
            category,
            user_id,
            title,
            body,
            header_image: req.files[0].filename,
            likes,
            description,
            image_alt,
            created_at: moment().zone("-03:00").format('YYYY-MM-DD hh:mm:ss')
        }

        // Fazer validação
        // const postValidation = Yup.object().shape({
        //     title: Yup.string().required(),
        //     body: Yup.string().required(),
        //     file: Yup.object().shape({
        //         path: Yup.string().required()
        //     })
        // })

        // await postValidation.validate(postData, {
        //     abortEarly: false
        // })
           

        const postsRepository = getRepository(Post);

        const post = postsRepository.create(postData);

        await postsRepository.save(post);

        return res.status(201).json(post);
    },

    async update(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const { id } = req.params;

        try {
            await uploadFile(req, res)      
        } catch (err) {
            res.status(500).send({
                message: `Could not upload the file: ${req.files[0].originalname}. ${err}`,
            });
        }    

        const {
            category,
            user_id,
            title,
            body,
            file,
            likes,
            description,
            image_alt,
        } = req.body

        updateData = {
            category,
            title,
            body,
            header_image: typeof file == "string" ? file : req.files[0].filename,
            likes,
            description,
            image_alt,
        }

        const postsRepository = getRepository(Post);

        const post = postsRepository.update(id, updateData);

        return res.status(204).json(post);
    },

    async delete(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const { id } = req.params;
        console.log(`Querem remover ${id}`)
        const postsRepository = getRepository(Post);

        try {
            await postsRepository.delete(id)
        } catch (err) {
            return res.status(500).send({
                message: `Não foi possível remover o post: ${err}`,
            });
        }
        return res.status(204).json("Tudo certo");
    }
};