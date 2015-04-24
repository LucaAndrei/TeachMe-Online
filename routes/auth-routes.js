// app/auth-routes.js
var User = require('../models/user');
var crypto = require('crypto');
module.exports = function(app, db) {
    var passport = require('../config/passport.js')

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /")
        console.log("Is user logged in : " + req.username);
        //res.locals({username : req.username})
        //res.render('index.ejs',{username: req.username,});
        res.render('index.ejs')
    });


    // =====================================
    // SIGNUP ==============================
    // =====================================
    /*app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));*/


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/api/users/logout', function(req, res) {

        var session_id = req.cookies.session;
        console.log(" ---=== auth-routes.js --->>> /logout " + session_id);
        db.collection("user_session").remove({ '_id' : session_id }, function (err, numRemoved) {
            console.log("numRemoved : " + numRemoved)
            res.cookie('session', '');
            userLoggedIn = false; // This variable is used in the home page. If it is true, render the users [teacher/student] profile page; otherwise, render the index page
            //req.logout();
            return res.redirect('/');
        });
    });



    // =====================================
    // LOGIN ==============================
    // =====================================
    app.post('/login', function(req, res, next) {
        console.log(" ---=== auth-routes.js --->>> loginloginloginloginloginloginlogin")
        console.log(req.body)
        console.log("erq.user : " + req.user)
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            // if there are any errors, return the error before anything else
            console.log("here")
            if (err){
                console.log("error")
                return next(err);
            }
            //return done(err);
            if(user)
            {
                // if the user is found but the password is wrong
                console.log("req user pass : " + req.body.pass)
                if (!user.validPassword(req.body.pass)){
                    console.log("user is found, password is wrong");
                    return next(err);
                   // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                } else {
                    // Generate session id
                    var current_date = (new Date()).valueOf().toString();
                    var random = Math.random().toString();
                    var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                    // Create session document
                    var session = {'username': req.body.email, '_id': session_id, 'user_id' : user._id}

                    // Insert session document
                    db.collection('user_session').insert(session, function (err, result) {
                        "use strict";
                        console.log("usersession insert result",result);
                        res.cookie('session', session_id);
                        console.log("res.cookie",res.cookie);
                        res.json(user);
                    });
                }

            } else {
                // if no user is found, return the message
                console.log("no user is found");
                return next(err);
            }
        });
    });


    app.param('email', function(req, res, next, email) {
        console.log("param user email: " + email);
        var query = User.findOne({nume : email});
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                console.log("cant find user")
                //return next(new Error("can't find user"));
            }
            console.log("param user : " + user);
            req.user = user;
            return next();
        });
    });
};