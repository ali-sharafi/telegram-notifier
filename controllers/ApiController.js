const { default: axios } = require("axios");
const { getDateTime } = require("../utils/tools");
const _ = require('lodash');
const User = require("../models/user");
const moment = require('moment');
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const L_OPEN_MESSAGE_ID = process.env.L_OPEN_MESSAGE_ID;
const L_CLOSE_MESSAGE_ID = process.env.L_CLOSE_MESSAGE_ID;
const SCH_OPEN_MESSAGE_ID = process.env.SCH_OPEN_MESSAGE_ID;
const SCH_CLOSE_MESSAGE_ID = process.env.SCH_CLOSE_MESSAGE_ID;
const ST_OPEN_MESSAGE_ID = process.env.ST_OPEN_MESSAGE_ID;
const ST_CLOSE_MESSAGE_ID = process.env.ST_CLOSE_MESSAGE_ID;
var lastSentTime = {
    '2': 0,
    '3': 0,
    '1': 0,
};
const delayThreshold = 60000;

const ApiController = class {
    async sendTelNotif(req, res) {
        let message = req.query.message;//chat_id is group id and reply_to_message_id is the topic created message id
        let payload = req.query.payload;
        let type = req.query.type;
        const currentTime = Date.now();
        const timeSinceLastSent = currentTime - (lastSentTime[type] ?? 0);
        if (timeSinceLastSent < delayThreshold) {
            res.send('success');
            return;
        }
        lastSentTime[type] = currentTime;
        let topic = this.getTopicID(type, message);
        let telMessage = message == 'close' ? 'close' : `${message}:${payload}`;
        axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${telMessage}&reply_to_message_id=${topic}`);
        res.send('success');
    }

    async updateUser(auth, res) {
        let user = await User.findOne({
            where: {
                id: auth.sub,
            }
        });
        if (user) {
            if (!user.updated_at) {
                await User.update(
                    { updated_at: new Date() },
                    { where: { id: auth.sub } }
                )
                return res.json({ success: true });
            } else if (this.isMoreThan24Hours(user.updated_at)) {
                return res.status(400).json({ message: 'You can not update your info after 24 hours.' });
            }
            res.json({ success: true });
            return
        }
        res.status(400).json({ message: 'We could not find your account.' });
    }

    getTopicID(type, message) {
        switch (type) {
            case '3'://L-Topic
                return message == 'close' ? L_CLOSE_MESSAGE_ID : L_OPEN_MESSAGE_ID;
            case '2'://SCh-Topic
                return message == 'close' ? SCH_CLOSE_MESSAGE_ID : SCH_OPEN_MESSAGE_ID;
            case '1'://ST-Topic
                return message == 'close' ? ST_CLOSE_MESSAGE_ID : ST_OPEN_MESSAGE_ID;
            default:
                return message == 'close' ? L_CLOSE_MESSAGE_ID : L_OPEN_MESSAGE_ID;
        }
    }

    isMoreThan24Hours(updatedAt) {
        const lastModifiedAt = new Date(updatedAt);
        const now = new Date();
        const timeDifference = now - lastModifiedAt;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        return hoursDifference > 24;
    }
}

module.exports = new ApiController();