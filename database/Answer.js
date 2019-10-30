const Sequelize = require('sequelize');
const connection = require('./database');

const Answer = connection.define('answer', {
    content:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    questionId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Answer.sync({force: false}).then(() => {
    console.log('Answers table created!')
}).catch((err) => {
    console.log(err)
});

module.exports = Answer;