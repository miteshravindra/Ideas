const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load idea Model
require('../Models/Idea');
const Idea = mongoose.model('ideas');


// Add Idea form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Edit idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error_msg', 'Not Authorized!');
                res.redirect('/ideas');
            }
            else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// Idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({date: 'desc'})
        .then(ideas => {
            res.render('ideas/ideasPage', {
                ideas: ideas
            });
        });
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newUser)
            .save().then((ideas) => {
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        })
    }

});

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then((idea) => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Video idea updated');
                res.redirect('/ideas');
            })
    });
});

//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router;