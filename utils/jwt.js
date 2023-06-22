const { expressjwt } = require('express-jwt');
const User = require('../models/user');

function jwt() {
    const secret = process.env.JWT_SECRET;
    return expressjwt({ secret, algorithms: ['HS256'], isRevoked, getToken }).unless({
        path: [
            // public routes that don't require authentication
            '/auth/login',
            '/auth/register',
        ]
    });
}

function getToken(req) {
    return req.headers.authorization ? req.headers.authorization : null
}

async function isRevoked(req, payload) {
    // const user = await User.findById(payload.payload.sub);
    const token = req.headers.authorization
    const user = await User.findOne({
        where: {
            id: payload.payload.sub,
            enabled: 1
        }
    });

    // revoke token if user no longer exists
    if (!user) {
        return true;
    }

    return false;
};

module.exports = jwt;