const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Question = require('./database/Question');
const Answer = require('./database/Answer');

connection.authenticate().then(() => {
    console.log('Database connected.');
}).catch((errorMessage) => {
    console.log(errorMessage);
});


app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    Question.findAll({
        raw: true,
        order: [['id', 'DESC']]
    }).then(questions => {
        res.render('index', {
            questions:questions
        });
    })
});

app.get('/ask', (req, res) => {
    res.render('ask');
});

app.get('/question/:id', (req, res) => {
    let id = req.params.id;
    Question.findOne({
        where: {id : id}
    }).then(question => {
        if(question !== undefined) {
            Answer.findAll({
                where: {questionId: question.id},
                order: [['id', 'DESC']]
            }).then(answers => {
                res.render('question', {
                    answers: answers,
                    question: question
                });
            });
        } else {
            res.redirect('/')
        }
    });
});

app.post('/send_ask', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let date = new Date();
    let dateBrasilia = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);

    Question.create({
        title: title,
        description: description,
        createdAt: dateBrasilia,
        updatedAt: dateBrasilia
    }).then(() => {
        res.redirect('/');
    })
});

app.post('/send-answer', (req, res) => {
    let content = req.body.content;
    let questionId = req.body.questionId;
    let date = new Date();
    let dateBrasilia = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);

    Answer.create({
        content: content,
        questionId: questionId,
        createdAt: dateBrasilia,
        updatedAt: dateBrasilia
    }).then(() => {
        res.redirect('/question/' + questionId);
    })
})

app.listen(8080, (err) => {
    if(err) return res.console.log('Server has problem.');
    console.log('Server is running...');
});