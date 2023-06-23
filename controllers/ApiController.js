const { default: axios } = require("axios");
const { getDateTime } = require("../utils/tools");
const _ = require('lodash');
const User = require("../models/user");
const moment = require('moment');
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPEN_MESSAGE_ID = process.env.OPEN_MESSAGE_ID;
const CLOSE_MESSAGE_ID = process.env.CLOSE_MESSAGE_ID;
var lastSentTime = 0;
const delayThreshold = 60000;

const ApiController = class {
    async sendTelNotif(req, res) {
        const currentTime = Date.now();
        const timeSinceLastSent = currentTime - lastSentTime;
        if (timeSinceLastSent < delayThreshold) {
            res.send('success');
            return;
        }
        lastSentTime = currentTime;
        let message = req.query.message;//chat_id is group id and reply_to_message_id is the topic created message id
        let payload = req.query.payload;
        let topic = message == 'close' ? CLOSE_MESSAGE_ID : OPEN_MESSAGE_ID;
        axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}:${payload}&reply_to_message_id=${topic}`);
        res.send('success');
    }

    async updateUser(auth, res) {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        let user = await User.findOne({
            where: {
                id: auth.sub,
            }
        });
        if (user) {
            if (!user.updatedAt) {
                User.update(
                    { updatedAt: new Date() },
                    { where: { id: auth.sub } }
                )
            } else if (new Date(user.updatedAt) > twentyFourHoursAgo) {
                return res.status(400).json({ message: 'You can not update your info after 24 hours.' });
            }
            return res.status(200).json({ success: true });
        }
        res.status(400).json({ message: 'We could not find your account.' });
    }
}

module.exports = new ApiController();