const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user modal
const users = mongoose.model('users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({usernameField: 'email'},
        (email, password, done) => {
            // Match the user
            users.findOne({
                email: email
            })
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: "No User found!"})
                    }
                    // If user matches check if the password matches
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, {message: "Sorry we don't recognize you. Login credentials incorrect!"});
                        }
                    })
                })
        }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        users.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
