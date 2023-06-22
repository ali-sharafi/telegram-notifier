const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { UnauthorizedError } = require('express-jwt');
const http = require('http');
const app = express();
const server = http.createServer(app);
const authHandler = require('./routes/auth');
const apiHandler = require('./routes/api');
const auth = require('./utils/jwt');
const serverPort = process.env.SERVER_PORT;

app.use(express.json());
app.use('/auth', authHandler);
app.use(auth())
app.use('/api', apiHandler);

app.use(function (err, req, res, next) {
    if (err instanceof UnauthorizedError) {
        res.status(200).json({ message: 'invalid token...', unauthorized: true });
    } else console.log('error: ', err);
});

const startApp = async () => {
    console.log('SETUP HTTP ROUTE HANDLERS...');

    server.listen(serverPort, () => console.log(`DONE! APP STARTED ON PORT ${serverPort}!`));
}

startApp();