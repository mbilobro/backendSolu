const fs = require("fs");
const path = require("path");
const { getRepository } = require("typeorm")
const Downloadable = require('../models/Downloadable')
const uploadFile = require('../config/fileUploadMiddleware')
const DownloadableView = require('../views/downloadable_view')


module.exports = {
    async index(req, res) {
        const downloadableRepository = getRepository(Downloadable)
        const downloadables = await downloadableRepository.find()
        return res.json(DownloadableView.renderMany(downloadables))
    },
    async create(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        try {
            await uploadFile(req, res)
            
            if(!req.files || req.files.length === 0) return res.status(400).send({
                error: 'Por favor, selecione os arquivos corretamente'
            })
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }

        const { body, title } = req.body
        
        try {
            const downloadableRepository = getRepository(Downloadable)

            const hasImage = req.files.filter(item => (
                item.mimetype.includes("image") ? item : null
            ))

            if (hasImage.length === 0) throw new Error("Por favor, selecione uma imagem")
            
            const hasPdf = req.files.filter(item => (
                item.mimetype.includes("application/pdf") ? item : null
            ))

            if (hasPdf.length === 0) throw new Error("Por favor, selecione um arquivo pdf válido")
                
            const downloadable = downloadableRepository.create({
                body,
                title,
                image_name: hasImage[0].filename,
                content_name: hasPdf[0].filename
            })
            await downloadableRepository.save(downloadable)
            return res.status(200).json(downloadable)
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async upload(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const { id } = req.params

        try {
            const downloadableRepository = getRepository(Downloadable)
            const hasDownloadable = await downloadableRepository.findOne({
                where: { id },
            })
            if(!hasDownloadable) return res.status(404).send({
                error: 'downloadable not found'
            })

            await uploadFile(req, res)

            const {
                body,
                title,
            } = req.body
            
            if(!req.files || req.files.length === 0) {
                await downloadableRepository.update(id, {
                    body,
                    title,
                })
                return res.status(200).send()
            }

            let imageName = hasDownloadable.image_name
            const hasImage = req.files.filter(item => (
                item.mimetype.includes("image") ? item : null
            ))
            if (hasImage.length !== 0) {
                fs.unlink(path.resolve(__dirname, "..", "uploads", imageName), () => {}) 
                imageName = hasImage[0].filename
            } 
                
            let contentName = hasDownloadable.content_name
            const hasPdf = req.files.filter(item => (
                item.mimetype.includes("application/pdf") ? item : null
            ))
            if (hasPdf.length !== 0) {
                fs.unlink(path.resolve(__dirname, "..", "uploads", contentName), () => {}) 
                contentName = hasPdf[0].filename
            }

            await downloadableRepository.update(id, {
                body,
                title,
                image_name: imageName,
                content_name: contentName
            })
            return res.status(200).send()
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async delete(req, res) {
        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });
        const { id } = req.params

        try {
            const downloadableRepository = getRepository(Downloadable)
            const downloadable = await downloadableRepository.findOne({
                where: { id },
            })
            if(!downloadable) return res.status(404).send({
                error: 'downloadable not found'
            })
            downloadableRepository.remove(downloadable)
            return res.status(200).send()
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    }
}