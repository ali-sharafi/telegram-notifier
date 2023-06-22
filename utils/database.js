const { Sequelize } = require('sequelize');


const sequelize = new Sequelize(process.env.MYSQL_DATABASE, 'root', process.env.MYSQL_PASSWORD, {
    host: 'mysql',
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',
    },
    logging: false
});

sequelize
    .authenticate()
    .then(function (err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

module.exports = sequelize;