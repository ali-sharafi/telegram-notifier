const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const serverPort = process.env.SERVER_PORT;


app.get('/telegram-notif', (req, res) => {
    // Handle the request for /telegram-notif route
    res.send('Hello from /telegram-notif!');
});


const startApp = async () => {
    console.log('SETUP HTTP ROUTE HANDLERS...');

    server.listen(serverPort, () => console.log(`DONE! APP STARTED ON PORT ${serverPort}!`));
}

startApp();