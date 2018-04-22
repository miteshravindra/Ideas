const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');


const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/ideas-app-dev')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Load idea Model
require('./Models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express-session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//middleware for connect-flash
app.use(flash());

//Global variables
app.use(function(req,res,next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
});

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Add Idea form

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit idea form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('ideas/edit', {
                idea: idea
            });
        });
});

// Idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/ideasPage', {
                ideas: ideas
            });
        });
});

// Process form

app.post('/ideas', (req, res) => {
    let error = [];
    if (!req.body.title || !req.body.details) {
        if (!req.body.title) {
            error.push({text: 'Title is required'});
        }
        if (!req.body.details) {
            error.push({text: 'Detail is required'});
        }
        res.render('ideas/add', {
            pageError: error,
            title: req.body.title,
            details: req.body.details
        })
    }
    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        };
        new Idea(newUser)
            .save().then((ideas) => {
            req.flash('success_msg','Video idea added');
            res.redirect('/ideas');
        })
    }

});

// Edit form process

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then((idea) => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg','Video idea updated');
                res.redirect('/ideas');
            })
    });
});

//Delete idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg','Video idea removed');
        res.redirect('/ideas');
    });
});
app.listen(500, function () {
    console.log('App is listening');
});