var User = require('../models/user');
var formidable = require('formidable'),
    util = require('util')
    fs   = require('fs-extra');
module.exports = function(app, db) {


    app.use('/api', function(req, res, next) {
        var session_id = req.cookies.session;
        if (!session_id) {
            res.status(404).send('Not found');
        } else {
            db.collection('user_session').findOne({
                '_id': session_id
            }, function(err, session) {
                "use strict";
                if (!err && session) {
                    req.user_id = session.user_id;
                    return next();
                }
            });
        }
    });

    app.get("/cookie", function(req, res, next) {
        var session_id = req.cookies.session;
        if (session_id) {
            db.collection('user_session').findOne({
                '_id': session_id
            }, function(err, session) {
                "use strict";

                if (err) {
                    return next(err);
                }

                if (!session) {
                    res.json();
                }

                if (!err && session) {
                    User.findOne({
                        _id: session.user_id
                    }, function(err, user) {
                        if (err) {
                            return next(err);
                        }
                        res.json(user);
                    })
                }
            });
        } else {
            res.json();
        }
    });

    app.param('user', function(req, res, next, id) {
        var query = User.findById(id);
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("can't find user"));
            }
            req.user = user;
            return next();
        });
    });

    app.put('/api/users/updateUser', function(req, res, next) {
        User.update({
            _id: req.user_id
        }, {
            $set: {
                "nume": req.body.nume,
                "prenume": req.body.prenume,
                "email": req.body.email
            }
        }, function(err, updated) {
            if (err) {
                return next(err);
            }
            res.json(updated);
        });
    });

    app.post('/upload', function(req, res) {
        var form = new formidable.IncomingForm();
        form.on('end', function(fields, files) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'public/images/uploads/';
            if (file_name == "") {
                var session_id = req.cookies.session;
                db.collection('user_session').findOne({
                    '_id': session_id
                }, function(err, session) {
                    "use strict";
                    User.update({
                        _id: session.user_id
                    }, {
                        $set: {
                            "imgPath": "images/uploads/dummyuser.png"
                        }
                    }, function(err, updated) {
                        if (err) {
                            return next(err);
                        }
                    })
                });
            } else {
                var session_id = req.cookies.session;
                db.collection('user_session').findOne({
                    '_id': session_id
                }, function(err, session) {
                    "use strict";
                    var new_file_name = session.user_id + "_" + file_name;
                    fs.copy(temp_path, new_location + new_file_name, function(err) {
                        if (err) {
                            return next(err);
                        } else {
                            User.update({
                                _id: session.user_id
                            }, {
                                $set: {
                                    "imgPath": "images/uploads/" + new_file_name
                                }
                            }, function(err, updated) {
                                if (err) {
                                    return next(err);
                                }
                            })
                        }
                    });
                });

            }
        });
        form.parse(req, function(err, fields, files) {
            res.redirect('/')
        });
    });

    app.get('/api/users/loginToChat', function(req, res, next) {
        User.findOne({
            _id: req.user_id
        }, function(err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                res.json(user.loggedInChat)
            }
        })
    });

    app.put('/api/users/loginToChat', function(req, res, next) {
        User.findOne({
            _id: req.user_id
        }, function(err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                user.loggedInChat = true;
                user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(user.loggedInChat)
                });
            }
        })
    });
};

