const { getRepository, MoreThan } = require("typeorm");
const ConfigPS = require("../models/ConfigPS");

module.exports = {

    async index(req, res) {
        const configRepository = getRepository(ConfigPS);

        const config = await configRepository.find();

        return res.status(200).send(config[0]);
    },

    async change(req, res) {

        if (!req.admin) return res.status(401).send({
            error: 'user not authorized'
        });

        const { value } = req.params; 

        const configRepository = getRepository(ConfigPS);

        const hasConfig = await configRepository.find();

        if (hasConfig) await configRepository.remove(hasConfig);
        
        const newConfig = configRepository.create({ view: value });
        await configRepository.save(newConfig);

        return res.status(200).send();
    }

};