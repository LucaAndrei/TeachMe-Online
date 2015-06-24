var User = require('../models/user');
var crypto = require('crypto');
module.exports = function(app, db) {

    // =====================================
    // HOME PAGE ===========================
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs')
    });

    // =====================================
    // LOGIN ==============================
    // =====================================
    app.post('/login', function(req, res, next) {
        User.findOne({
            'email': req.body.email
        }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return next(err);
            }
            if (user) {
                // if the user is found but the password is wrong
                if (!user.validPassword(req.body.pass)) {
                    return next(err);
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
                    var session = {
                        'username': req.body.email,
                        '_id': session_id,
                        'user_id': user._id,
                        'created_at': new Date()
                    }

                    // Insert session document
                    db.collection('user_session').insert(session, function(err, result) {
                        "use strict";
                        res.cookie('session', session_id);
                        res.json(user);
                    });
                }
            } else {
                // if no user is found
                return next(err);
            }
        });
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    app.post('/signup', function(req, res, next) {
        User.findOne({
            'email': req.body.email
        }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return next(err);
            }
            if (user) {
                return next(err);
            } else {
                var newUser = new User();
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(req.body.pass);
                newUser.nume = req.body.nume;
                newUser.prenume = req.body.prenume;
                newUser.facultate = req.body.facultate;
                newUser.tipUser = req.body.tipUser;
                newUser.imgPath = "images/uploads/dummyuser.png";

                newUser.save(function(err) {
                    if (err)
                        throw err;
                    var current_date = (new Date()).valueOf().toString();
                    var random = Math.random().toString();
                    var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');

                    // Create session document
                    var session = {
                        'username': req.body.email,
                        '_id': session_id,
                        'user_id': newUser._id
                    }

                    // Insert session document
                    db.collection('user_session').insert(session, function(err, result) {
                        "use strict";
                        res.cookie('session', session_id);
                        res.json(newUser);
                    });
                });
            }
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        var session_id = req.cookies.session;

        db.collection('user_session').findOne({
            '_id': session_id
        }, function(err, session) {
            User.findOne({
                _id: session.user_id
            }, function(err, user) {
                if (err) {
                    return next(err);
                }
                user.isOnline = false;
                user.loggedInChat = false;
                user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                });
            })
        })

        db.collection("user_session").remove({
            '_id': session_id
        }, function(err, numRemoved) {
            res.cookie('session', '');
            return res.redirect('/');
        });
    });
};