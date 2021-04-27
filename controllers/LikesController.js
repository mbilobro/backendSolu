const { getRepository, MoreThan } = require("typeorm");
const Like = require('../models/Like')
const LikeView = require('../views/likes_view')
const _ = require("underscore");

const moment = require('moment');

module.exports = {

    async count(req, res) {
        const likeRepository = getRepository(Like);

        const likesCount = await likeRepository.count()

        return res.json(likesCount)
    },
 
    async likesYear(req, res) {
        const likeRepository = getRepository(Like);

        const lastYearStart = moment().subtract(1, 'years').startOf('year').format('YYYY-MM-DD hh:mm:ss')

        const likesLast2YearsDB = await likeRepository.find({
            where: {
                created_at: MoreThan(lastYearStart)
            }
        })
        likesLast2Years = LikeView.renderMany(likesLast2YearsDB)

        // Transforma todas as datas em tipo Date do Javascript
        likesLast2Years = _.each(likesLast2Years, function(data){
            var dateParts = data.created_at.split(' ')[0].split('/')
            data.created_at = new Date(dateParts[2], dateParts[1] - 1 , dateParts[0])
        });
        

        var DTMonthsYear = []
        var currentMonth = moment().subtract(1, 'years').startOf('year')
        for (year = 0; year < 2; year++){
            DTMonthsYear.push([])
            for (month = 0; month < 12; month++) {
                let monthStart = currentMonth.startOf('month').toDate()
                let monthEnd = currentMonth.endOf('month').toDate()

                if (monthStart > Date.now()) break
                
                var monthLikes = _.filter(likesLast2Years, function(data){
                    return (data.created_at >= monthStart && data.created_at <= monthEnd);
                });  
                DTMonthsYear[year].push(_.size(monthLikes))
                currentMonth.add(1, "month")
            }
        }
        

        return res.json(DTMonthsYear)
    }
};