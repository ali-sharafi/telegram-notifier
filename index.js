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
const MESSAGE_ID = process.env.MESSAGE_ID;


app.get('/tel-notif', (req, res) => {
    let message = req.query.message;//chat_id is group id and reply_to_message_id is the topic created message id
    axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${message}&reply_to_message_id=${MESSAGE_ID}`);
    res.send('success');
});


const startApp = async () => {
    console.log('SETUP HTTP ROUTE HANDLERS...');

    server.listen(serverPort, () => console.log(`DONE! APP STARTED ON PORT ${serverPort}!`));
}

startApp();