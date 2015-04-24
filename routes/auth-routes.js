// app/auth-routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
var UserSession = require('../models/user_session');
module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /")
        console.log("Is user logged in : " + userLoggedIn);
        if (userLoggedIn) {
            // The user is logged in
            // When it renders the dashboard according to the type of user, also send the 'user' object
            if (req.user.tipUser == "teacher") {
                // If the type of the user that is logged in is 'teacher', render the page with the 'teacher dashboard'
                res.render('profile-profesor.ejs', {
                    user: req.user // get the user out of session and pass to template
                });
            } else {
                // If the type of the user that is logged in is not 'teacher' (this means that it is 'student'), render the page with the 'student dashboard'
                res.render('profile-elev.ejs', {
                    user: req.user // get the user out of session and pass to template
                });
            }
        } else {
            // If the user is not logged in, render the index page
            res.render('index.ejs');
        }
    });

    // =====================================
    // EVENTS ===============================
    // =====================================
    // show the classes page


    /***************** TODO *************/
    /*
     *
     *
     *   Display a message on the login page if the login process was not successful
     *   If the user tried to signup, display some other message
     *
     *
     */
    // process the login form
   /* app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // If the login was successful, redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));
*/
    // =====================================
    // SIGNUP ==============================
    // =====================================
    // The view for the signup form is handled in the login application controller [loginApp.js]
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the login page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /profile")
            // Render the page according to the type of user that has successfuly logged in
        if (req.user.tipUser == "teacher") {
            res.render('profile-profesor.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        } else {
            res.render('profile-elev.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        }
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /logout")
        userLoggedIn = false; // This variable is used in the home page. If it is true, render the users [teacher/student] profile page; otherwise, render the index page
        req.logout();
        res.redirect('/');
    });

    app.get('/profile-settings', function(req, res) {
        console.log(" ---=== auth-routes.js --->>> /profile-settings")
        res.render('profile-settings.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });
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

                // if no user is found, return the message
                if (!user){
                    console.log("no user is found");
                    return next(err);
                   // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                console.log("req user pass : " + req.body.pass)
                if (!user.validPassword(req.body.pass)){
                    console.log("user is found, password is wrong");
                    return next(err);
                   // return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                }
                if(user)
                {
                    // CREATE USER SESSION
                    console.log("who is this user");
                    console.log(user);
                    UserSession.remove({'user' : user._id}, function(err, userSession){
                        if (err){
                            console.log("UserSession error")
                            return next(err);
                        }
                            //return done(err);

                        // if no userSession is found, return the message
                        if (!userSession){
                            console.log("no userSession is found");
                            return next(err);
                           // return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        }
                        if(userSession){
                            console.log("userSession >> ",userSession);
                            console.dir(userSession)
                        }

                    })
                    var SessionStart = Date.now();
                    var SessionEnd = Date.now() + (6 * 3600 * 1000);
                    var cookie = Math.round((Math.pow(36, 32 + 1) - Math.random() * Math.pow(36, 32))).toString(36).slice(1);
                    console.log("cookie is : " + cookie);

                    var newSession = new UserSession();
                    newSession.user    = user._id;
                    newSession.SessionStart = SessionStart;
                    newSession.SessionEnd = SessionEnd;
                    newSession.SessionCookie = cookie;
                    newSession.save(function(err) {
                        if (err)
                            throw err;
                        console.log("newSession created");
                        console.log(newSession);
                        res.json({
                                user : user,
                                userSession : newSession});
                    });

                }


                console.log("session start : " + SessionStart);
                console.log("session end : " + SessionEnd);

                // all is well, return successful user
                console.log("all is well, return succesful user");
                console.log(">>>>>>>>");
                console.log(user)
                res.json(user);
                //return done(null, user);
        });
       // console.log(req)
        /*res.render('profile-settings.ejs', {
            user: req.user // get the user out of session and pass to template
        });*/
    });

app.get('/users/cookie',function(req,res){

    console.log("get users cookie");
    console.log(req)
})

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

// route middleware to make sure a user is logged in
var userLoggedIn = false;

function isLoggedIn(req, res, next) {
    console.log(" ---=== auth-routes.js --->>> isLoggedIn : " + req.isAuthenticated())
        // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        userLoggedIn = true;
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}