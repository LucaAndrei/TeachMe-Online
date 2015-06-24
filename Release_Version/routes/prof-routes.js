var User = require('../models/user');
var Task = require('../models/task');
var Class = require('../models/class');
var Grade = require('../models/grade');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, db) {


    /*
    * Finds all the users that have registered to any of the classes
    * added by the currently logged in user
    */
    app.get('/api/users/listUsers', function(req, res, next) {
        var Arr = new Array();
        var myUserList = [];
        var count = 0;
        User.find({
            "tipUser": "student"
        }, function(err, userList) {
            if (err) {
                return next(err);
            }
            Class.find({
                "user": req.user_id
            }, function(err, classList) {
                if (err) {
                    return next(err);
                }
                for (var i = 0; i < classList.length; i++) {
                    for (var t = 0; t < classList[i].registeredUsers.length; t++) {

                        for (var j = 0; j < userList.length; j++) {
                            if (("" + classList[i].registeredUsers[t]) == userList[j]._id) {
                                var index1 = Arr.indexOf(userList[j]._id);
                                if (index1 == -1) {
                                    Arr[count] = userList[j]._id;
                                    myUserList.push(userList[j]);
                                    count++;
                                }
                            }
                        }
                    }
                }
                res.json(myUserList);
            });
        });
    });


    /*
    * Finds all the classes that occur the current day to which the user has registered to
    */
    app.get('/api/users/my_classes/:day', function(req, res, next) {
        Class.find({
            $or: [{
                "registeredUsers": {
                    $in: [req.user_id]
                }
            }, {
                "user": req.user_id
            }],
            day: req.params.day
        }, function(err, classList) {
            if (err) {
                return next(err);
            } else if (classList) {
                res.json(classList);
            }
        });
    });


    /*
    * Finds the number of messages that were received while the user was offline (offline messages)
    */
    app.get('/api/users/my_messages', function(req, res, next) {
        var cursor = db.collection('chat').find({
            $or: [{
                'chatIDReceiver': "" + req.user_id
            }, {
                'chatIDSender': "" + req.user_id
            }]
        });
        var counter = 0;
        cursor.each(function(err, doc) {
            var found = false;
            if (doc != null) {
                if (doc.messages.length > 0) {
                    for (var i = 0; i < doc.messages.length; i++) {
                        if (doc.messages[i].seenBy.length > 0) {
                            found = false;
                            for (var j = 0; j < doc.messages[i].seenBy.length; j++) {
                                if (doc.messages[i].seenBy[j] == ("" + req.user_id)) {
                                    found = true;
                                }
                            }
                        }
                        if (!found) {
                            counter++;
                        }
                    }
                }
            } else {
                res.json(counter);
            }
        });
    });

    app.get('/api/users/getSelectedUser/:user', function(req, res, next) {
        res.json(req.user);
    });

    app.put('/api/users/grades/delete', function(req, res, next) {
        User.update({
            _id: req.body.user
        }, {
            $pull: {
                "grades": {
                    "_id": new ObjectId(req.body.uid)
                }
            }
        }, function(err, gradeDeleted) {
            if (err) {
                return next(err);
            } else if (gradeDeleted) {
                res.json(gradeDeleted);
            }
        });
    });


    /*
    * This function first finds if the user has any asigned grades.
    * If it doesn't, it immediately adds the grade received in req.body and sends the grade back to the caller
    * If the type of the grade that it's trying to be added is of type "exam" it immediately adds the grade.
    * If the type of the grade is something else it checks to see if the grade is trying to be updated or added
    * It does this by trying to find a grade with the same id as the grade received as parameter
    */
    app.put('/api/users/grades', function(req, res, next) {
        var flag = false;
        User.findOne({
            _id: req.body.user
        }, function(err, user) {
            if (err) {
                return next(err);
            } else if (user) {
                if (user.grades.length == 0) {
                    var grade = new Grade();
                    grade.user = req.body.user;
                    grade.name = req.body.name;
                    grade.nota = req.body.nota;
                    grade.data = req.body.data;
                    user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                    user.save(function(err, user) {
                        if (err) {
                            return next(err);
                        }
                        res.json(grade); // Send the grade back to the caller
                    });
                } else {
                    if (req.body.tip == "exam") {
                        var grade = new Grade();
                        grade.user = req.body.user;
                        grade.name = req.body.name;
                        grade.nota = req.body.nota;
                        grade.data = req.body.data;
                        user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                        user.save(function(err, user) {
                            if (err) {
                                return next(err);
                            }
                            res.json(grade); // Send the grade back to the caller
                        });
                    } else {
                        for (var i = 0; i < user.grades.length; i++) {
                            if (req.body.uid == user.grades[i]._id) {
                                User.update({
                                        _id: req.body.user,
                                        "grades._id": user.grades[i]._id
                                    }, {
                                        $set: {
                                            "grades.$.nota": req.body.nota
                                        }
                                    },
                                    function(err, userGrade) {
                                        if (err) {
                                            return next(err);
                                        } else if (userGrade) {
                                            // Grade has been found for this user. Updated successfuly");
                                        }
                                    }
                                );
                                res.json({
                                    message: "Grade has been updated"
                                });
                                flag = true;
                                break;
                            }
                        }
                        if (flag == false) {
                            var grade = new Grade();
                            grade.user = req.body.user;
                            grade.name = req.body.name;
                            grade.nota = req.body.nota;
                            grade.data = req.body.data;
                            user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                            user.save(function(err, user) {
                                if (err) {
                                    return next(err);
                                }
                                res.json(grade); // Send the grade back to the caller
                            });
                        }
                    }
                }
            }
        });
    });


    /*
    * This function modifies the acces to the user.
    * After it finds the task with the id received as parameter,
    * it checks to see if the access to the user is trying to be denied.
    * Otherwise, the access is granted.
    */
    app.put('/api/users/modifyAccessToUser/:user', function(req, res, next) {
        Task.findOne({
            _id: req.body.id
        }, function(err, task) {
            if (err) {
                throw err;
            }
            if (task) {
                var userAlreadyInserted = false;
                var registerUser = {
                    idUser: '' + req.user._id,
                    incercari: req.body.incercari,
                    lastAccessed: req.body.lastAccessed
                }
                for (var j = 0; j < task.registeredUsers.length; j++) {
                    if (task.registeredUsers[j].idUser == ('' + req.user._id)) {
                        userAlreadyInserted = true;
                        task.registeredUsers.splice(j, 1);
                        task.save(function(err, updatedTask) {
                            if (err) {
                                return next(err);
                            }
                            res.json(updatedTask);
                        });
                        break;
                    }
                }
                if (!userAlreadyInserted) {
                    task.registeredUsers.push(registerUser);
                    task.save(function(err, updatedTask) {
                        if (err) {
                            return next(err);
                        }
                        res.json(updatedTask);
                    });
                }
            }
        })
    });
};