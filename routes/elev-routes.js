// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, passport) {
    /*app.get('/grades', isLoggedIn, function(req, res) {
        console.log(" ---=== routes.js --->>> /grades")
        if (req.user.tipUser == "teacher") {
            res.render('grades.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        } else {
            res.render('userGrades.ejs', {
                user: req.user // get the user out of session and pass to template
            });
        }
    });*/

    app.get('/users/tasks/:user', function(req, res, next) {
        // This get is used when the 'teacher' wants to list the assigned tasks for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        console.log("app get /users/tasks/:user : " + req.user)
            //console.log("specific users tasks : " + req.user.tasks)
        req.user.populate('tasks', function(err, user) {
            res.json(user.tasks);
        });
    });

    app.get('/tasks', function(req, res) {
        // This get is used when the 'teacher' wants to list the assigned tasks for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        console.log("get tasks")
        Task.find({}, function(err, tasks) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (tasks) {
                console.log("tasks list");
                console.log(tasks);
                res.json(tasks);
            }
        });
    });

    app.get('/exams/:user', function(req, res, next) {
        // This get is used when the 'teacher' wants to list the assigned tasks for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        console.log("elev get tasks user id : ",req.user._id)
        Task.find({
            "registeredUsers.idUser" : {$in : [req.user._id]}
        }, function(err, exams) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (exams) {
                console.log("exams found");
                console.log(exams);
                res.json(exams);
            }
        });
    });


    app.get('/users/grades/:user', function(req, res, next) {
        // This get is used when the 'teacher' wants to list the assigned tasks for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        console.log("get users grades users : ",req.user._id)
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                console.log("user.grades",user.grades);
                res.json(user.grades);
                if (user.grades.length == 0) {
                    //console.log("This user has no grades.")
                    // Create a new Grade object based on the Grade model. Set the properties received from the request.
                    //res.send("Error. this user has no grades")
                } else {
                }
            }
        });
    });


    app.get('/grades/:user', function(req, res, next) {
        // This get is used when the 'teacher' wants to list the grades for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        //console.log("app get /grades/:user : " + req.user)
        //console.log("specific grades grades : " + req.user.grades)
        req.user.populate('grades', function(err, user) {
            res.json(user.grades);
        });
    });



    app.put('/users/classes/delete/:user', function(req, res, next) {
        console.log("app put /users/classes/delete/")
            //console.log("req.user : " + req.user);
            //console.log("req.body : " + req.body.class_id);
            //console.log("req.user.id >>>>>> : " + req.user._id);
            User.update({
                                _id: req.user._id
                            }, {
                                $pull: {
                                    "userClasses": {
                                        "_id": req.body.class_id
                                    }
                                }
                            },
                            function(err, eventDeleted) {
                                if (err) {
                                    //console.log("Error processing request. Cannot find user with this id with a userClasses with this name.");
                                } else if (eventDeleted) {
                                    //console.log("userClasses has been found for this user. eventDeleted successfuly");
                                }
                            }
                        );
        /*User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                //console.log("User has been found. Processing request ...");
                for (var i = 0; i < user.userClasses.length; i++) {
                    //console.log(">>>id : "  + user.userClasses[i]._id);
                    if (req.body.class_id == user.userClasses[i]._id) {
                        //console.log("event with this id found : " + user.userClasses[i].subject);

                        break;
                    }
                }
                res.send("No event with this id found");
            }
        });*/
    });


    app.post('/users/subjects/:user', function(req, res, next) {
        console.log("app post /users/subjects/:user")
            //console.log("req.user : " + req.user);
            //console.log("req.body.name : " + req.body.name);
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
        });
    });



app.put('/userAccessedTest/:user', function(req, res, next) {
        console.log("app put /userAccessedTest/:user")
        console.log("req.user",req.user);
        console.log("req.body",req.body);
        Task.findOne({
            _id : req.body.idTest
        }, function(err, task){
            if(err){
                throw err;
            }
            if(task){
                console.log("task found",task);
                /*var userAlreadyInserted = false;
                var registerUser = {
                    idUser : ''+req.user._id,
                    incercari : req.body.incercari,
                    lastAccessed : req.body.lastAccessed
                }*/
                    for(var j = 0; j<task.registeredUsers.length;j++){
                        console.log("task.registeredUsers[j].idUser >> " + task.registeredUsers[j].idUser)
                        console.log("req.user._id >> " + req.user._id);
                        if(task.registeredUsers[j].idUser == ('' + req.user._id)){
                            console.log("user found in this array");
                            task.registeredUsers[j].lastAccessed = req.body.today;
                            task.save(function(err, updatedTask) {
                                if (err) {
                                    return next(err);
                                }
                                console.log("updated task after modified date",updatedTask);
                                res.json(updatedTask);
                            });
                            break;
                        }
                    }

            } else {
                console.log("error task not found");
            }
        })
    });
};


// route middleware to make sure a user is logged in
var userLoggedIn = false;

function isLoggedIn(req, res, next) {
    console.log(" ---=== routes.js --->>> isLoggedIn : " + req.isAuthenticated())
        // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        userLoggedIn = true;
        return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
}