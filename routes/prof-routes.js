// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, passport) {


    app.get('/listUsers', function(req, res, next) {
        console.log("/listUsers");
        //console.log("req: ",req)
        //console.log("req.body", req.query.userCredentials)
        var Arr = new Array();
        var myUserList = [];
        var count = 0;
        var json = JSON.parse(req.query.userCredentials);
        //console.log("json",json._id)
        User.find({
                "tipUser": "student"
            }, function(err, userList) {
                if (err) {
                    //console.log("err : " + err);
                    return next(err);
                }
                Class.find({
                    "user" : ""+json._id
                }, function(err, classList) {
                    if (err) {
                        //console.log("Error while trying to find user.");
                    }
                    //console.log("classList",classList)
                    //console.log("userList",userList)
                    for(var i = 0 ; i <classList.length ; i++){
                        //console.log("classList[i].registeredUsers.length : " + classList[i].registeredUsers.length)
                        for(var t = 0; t<classList[i].registeredUsers.length ; t++){
                            for(var j = 0 ; j <userList.length ; j++){
                                //console.log("classList[i].registeredUsers[t] : " + classList[i].registeredUsers[t])
                                //console.log("userList[j]._id : " + userList[j]._id)
                                if(("" + classList[i].registeredUsers[t]) == userList[j]._id){
                                        //console.log("this user found : " + userList[j]._id)
                                       var index1 = Arr.indexOf(userList[j]._id);
                                        if(index1 == -1){
                                            Arr[count] = userList[j]._id;
                                            myUserList.push(userList[j]);
                                            count++;
                                        }
                                }
                            }
                        }
                    }
                    console.log("Arr is ",Arr)
                    //console.log("userList : " + myUserList);
                    res.json(myUserList);
                });

            });
    });

    app.get('/listSubjects', function(req, res, next) {
        console.log("/listUsers");
        // Search through the User model all the objects that have the property 'tipUser : student'
        Subject.find({}, function(err, subjectList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            console.log("subjectList : " + subjectList);
            res.json(subjectList);
        });
    });




    app.get('/prof/getSelectedUser/:user', function(req, res, next) {
        console.log("app get /users/tasks/:user : "); // + req.user)
        res.json(req.user);
    });


    app.put('/users/grades/delete/:user', function(req, res, next) {
        console.log("app post /users/grades/delete/:user")
        //console.log("req.user : " + req.user);
        //console.log("req.body : ",req.body);
        //console.log("req.body uid: " + req.body.uid);
        //console.log("req.user.id >>>>>> : " + req.user._id);
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                 User.update({
                                    _id: req.user._id
                                }, {
                                    $pull: {
                                        "grades": {
                                            "_id": req.body.uid
                                        }
                                    }
                                },
                                function(err, gradeDeleted) {
                                    if (err) {
                                        console.log("Error processing request. Cannot find user with this id with a events with this name.");
                                    } else if (gradeDeleted) {
                                        console.log("grade has been found for this user. gradeDeleted successfuly");
                                    }
                                }
                            );
                            res.send("Grade deleted successfuly");
            }
        });
    });

    app.put('/users/grades/:user', function(req, res, next) {
        console.log("app put /users/grades/:user")
        //console.log("req.user : " + req.user);
        // console.log("req.body : ",req.body);
        //console.log("req.body id: " + req.body.uid);
        //console.log("req.user.id >>>>>> : " + req.user._id);
        var flag = false;
        User.findOne({
            _id: req.user._id
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                // console.log("User has been found. Processing request ...");
                //console.log("user grades : " + user.grades.length)
                console.log("req bodty name : " + req.body.name)
                console.log("req bodty nota : " + req.body.nota)
                console.log("req bodty data : " + req.body.data)
                //console.log("req bodty data : " + req.body.data)
                if (user.grades.length == 0) {
                    var grade = new Grade();
                    grade.user = req.user;
                    grade.name = req.body.name;
                    grade.nota = req.body.nota;
                    grade.data = req.body.data;
                    //console.log("i am here")
                    console.dir(grade)
                    req.user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                    req.user.save(function(err, user) {
                        if (err) {
                            return next(err);
                        }
                        res.json(grade); // Send the grade back to the caller
                    });
                } else {
                    for (var i = 0; i < user.grades.length; i++) {
                        //console.log(">>>id : "  + user.grades[i]._id);
                        if (req.body.uid == user.grades[i]._id) {
                            //console.log("><><><><><><><><><<><><> grade has been found : " + user.grades[i]._id);
                            User.update({
                                    _id: req.user._id,
                                    "grades._id": user.grades[i]._id
                                }, {
                                    $set: {
                                        "grades.$.nota": req.body.nota
                                    }
                                },
                                function(err, userGrade) {
                                    if (err) {
                                        //console.log("Error processing request. Cannot find user with this id with a grade with this name.");
                                    } else if (userGrade) {
                                        //console.log("Grade has been found for this user. Updated successfuly");
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
                        console.log("Creating new grade")
                         console.log("req bodty name : " + req.body.name)
                        console.log("req bodty nota : " + req.body.nota)
                        console.log("req bodty data : " + req.body.data)
                        var grade = new Grade();
                        grade.user = req.user;
                        grade.name = req.body.name;
                        grade.nota = req.body.nota;
                        grade.data = req.body.data;
                        //console.log("i am here")
                        //console.dir(grade)
                        req.user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                        req.user.save(function(err, user) {
                            if (err) {
                                return next(err);
                            }
                            res.json(grade); // Send the grade back to the caller
                        });
                    }
                }
            }
        });
    });

    app.post('/users/tasks/:user', function(req, res, next) {
        console.log("app post /users/:user/tasks")
            //console.log("req.user : " + req.user);
            //console.log("req.body : " + req.body);
            {
                // Create a new Task object based on the Task model. Set the properties received from the request.
                var task = new Task();
                task.user = req.user;
                task.body = req.body.body;
                task.nota = req.body.nota;
                task.timp = req.body.timp;
                console.dir(task)
            }

        task.save(function(err, task) {
            if (err) {
                return next(err);
            }
            //console.log("task : " + task);
            //console.log("req tasks : " + req.user.tasks)
            req.user.tasks.push(task); // Save the task and also push the task object in the user's tasks array
            req.user.save(function(err, user) {
                if (err) {
                    return next(err);
                }
                res.json(task); // Send the task back to the caller
            });
        });
    });

app.put('/modifyAccessToUser/:user', function(req, res, next) {
        console.log("app put /grantAccessToUser/:user")
        console.log("req.user",req.user);
        console.log("req.body",req.body);
        Task.findOne({
            _id : req.body.id
        }, function(err, task){
            if(err){
                throw err;
            }
            if(task){
                console.log("task found",task);
                var userAlreadyInserted = false;
                var registerUser = {
                    idUser : ''+req.user._id,
                    incercari : req.body.incercari,
                    lastAccessed : req.body.lastAccessed
                }
                    for(var j = 0; j<task.registeredUsers.length;j++){
                        console.log("task.registeredUsers[j].idUser >> " + task.registeredUsers[j].idUser)
                        console.log("req.user._id >> " + req.user._id);
                        if(task.registeredUsers[j].idUser == ('' + req.user._id)){
                            console.log("error, user already found in this array");
                            userAlreadyInserted = true;
                            task.registeredUsers.splice(j,1);
                            task.save(function(err, updatedTask) {
                                if (err) {
                                    return next(err);
                                }
                                console.log("updated task after splice",updatedTask);
                                res.json(updatedTask);
                            });
                            break;
                        }
                    }
                if(!userAlreadyInserted){
                    task.registeredUsers.push(registerUser);
                    console.log(registerUser);
                    task.save(function(err, updatedTask) {
                                if (err) {
                                    return next(err);
                                }
                                console.log("updatedTask",updatedTask);
                                res.json(updatedTask);
                            });
                } else {
                    console.log("user is already inserted.return error of some kind");

                }

            } else {
                console.log("error task not found");
            }
        })
    });

};