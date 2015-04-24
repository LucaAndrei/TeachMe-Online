// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, passport) {

    app.get('/getCurrentUser', function(req, res, next) {
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error while trying to find user.");
            }
            if (user) {
                console.log("found user. updating...")
                User.update({
                    _id: req.user._id
                }, {
                    $set: {
                        "isOnline" : true
                    }
                },
                function(err, setToOnline) {
                    if (err) {
                        //console.log("Error processing request. Cannot find user with this id with a userClasses with this name.");
                    } else if (setToOnline) {
                        //console.log("userClasses has been found for this user. eventDeleted successfuly");
                    }
                }
            );
                //console.log("User found with a subject with this name.");
                /*res.json({
                    message: "Subject with this name already exists."
                })*/
            } else {
                //console.log("A user with this id has been found, but it doesn't have a subject with this name.Creating new subject ...");
                // Create a new Subject object based on the Subject model. Set the properties received from the request.
            }
        });
        res.json(req.user);
    });

    app.param('user', function(req, res, next, id) {
        //console.log("param user id: " + id);
        var query = User.findById(id);
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("can't find user"));
            }
            //console.log("param user : " + user);
            req.user = user;
            return next();
        });
    });

    app.post('/onlineUsers/:user', function(req, res, next) {
        console.log("app post /users/subjects/:user")
        console.log("req user id : " + req.user._id);
        console.log("name  : " + req.user.nume);
        UserSession.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error while trying to find user.");
            }
            if (user) {
                console.log("found user session. updating...")
                //console.log("User found with a subject with this name.");
                /*res.json({
                    message: "Subject with this name already exists."
                })*/
            } else {
                //console.log("A user with this id has been found, but it doesn't have a subject with this name.Creating new subject ...");
                // Create a new Subject object based on the Subject model. Set the properties received from the request.
                console.log("didnt find user session. adding one now");
                var subject = new Subject();
                subject.user = req.user;
                subject.subject_name = req.body.name;
                console.dir("subject : " + subject)
                req.user.subjects.push(subject); // Save the subject and also push the subject object in the user's subjects array
                req.user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(subject); // Send the subject back to the caller
                });
            }
        });
            //console.log("req.user : " + req.user);
            //console.log("req.body.name : " + req.body.name);
       /* UserSession
        User.findOne({
            _id: req.user._id,
            'subjects.subject_name': req.body.name
        }, function(err, user) {
            if (err) {
                //console.log("Error while trying to find user.");
            }
            if (user) {
                //console.log("User found with a subject with this name.");
                res.json({
                    message: "Subject with this name already exists."
                })
            } else {
                //console.log("A user with this id has been found, but it doesn't have a subject with this name.Creating new subject ...");
                // Create a new Subject object based on the Subject model. Set the properties received from the request.
                var subject = new Subject();
                subject.user = req.user;
                subject.subject_name = req.body.name;
                console.dir("subject : " + subject)
                req.user.subjects.push(subject); // Save the subject and also push the subject object in the user's subjects array
                req.user.save(function(err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(subject); // Send the subject back to the caller
                });
            }
        });*/
    });


app.put('/updateUser/:user', function(req, res, next) {
        console.log("req.body",req.body);
        User.update({
            _id: req.user._id
        }, {
            $set : {
                "nume" : req.body.nume,
                "prenume" : req.body.prenume,
                "email" : req.body.email
            }
        }, function(err, updated) {
            if (err) {
                //console.log("Error while trying to find user.");
            }
            if (updated) {
                console.log("found user. updating...",updated)
                res.json(updated);
            } else {
                //console.log("A user with this id has been found, but it doesn't have a subject with this name.Creating new subject ...");
                // Create a new Subject object based on the Subject model. Set the properties received from the request.
                console.log("not updated");
            }
        });
        //res.json(req.user);
    });
};

