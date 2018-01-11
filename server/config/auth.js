let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');


passport.use(new LocalStrategy({
        usernameField: 'login'
    },
    function(username, password, done) {
        User.findOne({ login: username }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(true, false, { message: 'Incorrect username.' });
            }

            if (!user.validPassword(password)) {
                return done(true, false, { message: 'Incorrect password.' });
            }

            if(!user.hasConfirmed()) {
                return done(true, false, { message: 'Email not verified.' });
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});