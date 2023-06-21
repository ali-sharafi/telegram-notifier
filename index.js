const { default: axios } = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const serverPort = process.env.SERVER_PORT;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPEN_MESSAGE_ID = process.env.OPEN_MESSAGE_ID;
const CLOSE_MESSAGE_ID = process.env.CLOSE_MESSAGE_ID;

var lastSentTime = 0;
const delayThreshold = 60000;

app.get('/tel-notif', (req, res) => {
    const currentTime = Date.now();
    const timeSinceLastSent = currentTime - lastSentTime;
    if (timeSinceLastSent < delayThreshold) {
        res.send('success');
        return;
    }
    let message = req.query.message;//chat_id is group id and reply_to_message_id is the topic created message id
    let payload = req.query.payload;
    let topic = message == 'close' ? CLOSE_MESSAGE_ID : OPEN_MESSAGE_ID;
    axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}:${payload}&reply_to_message_id=${topic}`);
    res.send('success');
});


const startApp = async () => {
    console.log('SETUP HTTP ROUTE HANDLERS...');

    server.listen(serverPort, () => console.log(`DONE! APP STARTED ON PORT ${serverPort}!`));
}

startApp();