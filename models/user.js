const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    hash: {
        type: DataTypes.STRING
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_logged_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    captcha_used_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users'
});

module.exports = User;