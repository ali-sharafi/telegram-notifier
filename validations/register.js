const User = require("../models/user")

module.exports = {
    password: {
        isLength: {
            errorMessage: 'Password should be at least 7 chars long',
            options: { min: 7 },
        },
    },
    email: {
        normalizeEmail: true,
        custom: {
            options: value => {
                return User.findOne({
                    where: {
                        email: value
                    }
                }).then(user => {
                    if (user) {
                        return Promise.reject('Email address already taken')
                    }
                })
            }
        }
    }
}