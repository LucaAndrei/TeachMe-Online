var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport){
	// used to serialize the user for the session
    console.log(">>>>passport.js<<<<");
    passport.serializeUser(function(user, done) {
        console.log("passport.js - serializeUser");
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("passport.js - deserializeUser");
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function(req, email, password, done) {
            console.log("passports.js - /local-signup");
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                console.log("passports.js - /local-signup user.findone")
                // if there are any errors, return the error
                if (err){
                    console.log("error");
                    return done(err);
                }

                // check to see if theres already a user with that email
                if (user) {
                    console.log("passports.js - /local-signup user : " + user)
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    console.log("passports.js - /local-signup no user with that email");
                    // if there is no user with that email
                    // create the user
                    var newUser            = new User();

                    // set the user's local credentials
                    console.log(req.param('tipUser'))
                    if(req.param('tipUser') == undefined){
                        console.log("tip user is empty")
                    } else {
                        console.log(req.param('tipUser'))
                    }
                    newUser.email    = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.nume = req.param('nume');
                    newUser.prenume = req.param('prenume');
                    newUser.facultate = req.param('facultate');
                    if(req.param('tipUser') == undefined){
                        newUser.tipUser = 'student';
                    } else {
                        newUser.tipUser = req.param('tipUser');
                    }

                    /*console.log("newUser.email : " + email);
                    console.log("newUser.password : " + password);
                    console.log("newUser.nume : " + req.param('nume'));
                    console.log("newUser.prenume : " + req.param('prenume'));
                    console.log("newUser.facultate : " + req.param('facultate'));
                    console.log("newUser.tipUser : " + req.param('tipUser'));*/
                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });

            });

        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
        function(req, email, password, done) { // callback with email and password from our form
            console.log("passports.js - /local-login req : " + req);
            console.log("passports.js - /local-login email : " + email);
            console.log("passports.js - /local-login password : " + password);
            console.log("passports.js - /local-login done : " + done);
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user){
                    console.log("passports.js - /local-login no user is found");
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!user.validPassword(password)){
                    console.log("passports.js - /local-login user is found, password is wrong");
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }

                // all is well, return successful user
                console.log("passports.js - /local-login all is well, return succesful user");
                return done(null, user);
            });

        })
    );

};