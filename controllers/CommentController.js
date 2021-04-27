const { getRepository } = require("typeorm");
const Comment = require('../models/Comment')
const CommentView = require('../views/comment_view')

module.exports = {

    async index(req, res) {
        const CommentRepository = getRepository(Comment);

        const comments = await CommentRepository.find({ relations: ['user', 'post'] });
        return res.json(CommentView.renderMany(comments));
    },

    async count(req, res) {
        const CommentRepository = getRepository(Comment);

        const commentCount = await CommentRepository.count()

        return res.json(commentCount)
    },
};