const Sequelize = require('sequelize');
const pass = require('../pass')
const connection = new Sequelize('ask_answers', 'lustepe', pass,
    {
        host: 'localhost',
        dialect: 'mysql'
    });

module.exports = connection;