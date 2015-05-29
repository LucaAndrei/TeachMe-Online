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
        //res.cookie('session', '');
        res.render('index.ejs')
    });


    // =====================================
    // SIGNUP ==============================
    // =====================================
   /* app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash message
    }));*/


    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /logout " + session_id);
        console.log("app logout " + req.user_id)
        var session_id = req.cookies.session;

        db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
            User.findOne({_id : session.user_id},function(err,user){
                if(err) {
                    console.log("err")
                }
                console.log(">>>>>>>.retuyrn the user",user)
                user.isOnline = false;
                user.loggedInChat = false;
                 user.save(function(err, user) {
                        if (err) {
                            return next(err);
                        }
                    });
            })
        })


        db.collection("user_session").remove({ '_id' : session_id }, function (err, numRemoved) {
            //console.log("numRemoved : " + numRemoved)
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
        console.log(" ---=== auth-routes.js --->>> login")
        //console.log(req.body)
        //console.log("req.user : " + req.user)
        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            // if there are any errors, return the error before anything else
            //console.log("here")
            if (err){
                //console.log("error")
                return next(err);
            }
            if(user)
            {
                // if the user is found but the password is wrong
                //console.log("req user pass : " + req.body.pass)
                console.log("--------------------------",req.body.pass)
                if (!user.validPassword(req.body.pass)){
                    //console.log("user is found, password is wrong");
                    return next(err);
                   // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                } else {

                    user.isOnline = true;
                    user.save(function(err, user) {
                        if (err) {
                            return next(err);
                        }
                    });

                    // Generate session id
                    var current_date = (new Date()).valueOf().toString();
                    var random = Math.random().toString();
                    var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                    // Create session document
                    var session = {'username': req.body.email, '_id': session_id, 'user_id' : user._id, 'created_at' : new Date()}

                    // Insert session document
                    db.collection('user_session').insert(session, function (err, result) {
                        "use strict";
                        res.cookie('session', session_id);
                        res.json(user);
                    });
                }

            } else {
                // if no user is found, return the message
                //console.log("no user is found");
                return next(err);
            }
        });
    });

    app.post('/signup',function(req,res,next){
        console.log(" ---=== auth-routes.js --->>> signup")
            //console.log(req.body)
            //console.log("req.user : " + req.user)
            console.log(req.body);
            User.findOne({ 'email' :  req.body.email }, function(err, user) {
                // if there are any errors, return the error before anything else
                //console.log("here")
                if (err){
                    console.log("error")
                    return next(err);
                }
                if(user)
                {
                    console.log("user cu emailul asta a fost gasit")
                    return next(err);
                } else {
                        var newUser = new User();
                        newUser.email    = req.body.email;
                        newUser.password = newUser.generateHash(req.body.pass);
                        newUser.nume = req.body.nume;
                        newUser.prenume = req.body.prenume;
                        newUser.facultate = req.body.facultate;
                        newUser.tipUser = req.body.tipUser;
                        newUser.imgPath = "images/uploads/dummyuser.png";



                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            console.log(newUser);
                            var current_date = (new Date()).valueOf().toString();
                            var random = Math.random().toString();
                            var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                            // Create session document
                            var session = {'username': req.body.email, '_id': session_id, 'user_id' : newUser._id}

                            // Insert session document
                            db.collection('user_session').insert(session, function (err, result) {
                                "use strict";
                                res.cookie('session', session_id);
                                res.json(newUser);
                            });
                        });
                }
            });
    })
};