const Tweet = require('../models/Tweet');

module.exports = {
    async index(req, res) {
        const tweets = await Tweet.find({}).sort('-createdAt')

        return res.json(tweets);
    },

    async store(req, res) {
        try {
            const tweet = await Tweet.create(req.body);

            req.io.emit('tweet', tweet);

            return res.json(tweet);
        } catch (err) {
            return res.status(200).json({ err })
        }
    },

    async destroy(req, res) {
        try {
            const tweet = await Tweet.findByIdAndRemove(req.params.id);

            req.io.emit('delete-tweet', tweet);

            return res.json(tweet);
        } catch (err) {
            return res.status(200).json({ err })
        }
    }
}