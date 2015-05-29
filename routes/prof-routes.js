// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Class = require('../models/class');
var Grade = require('../models/grade');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, db) {


    app.get('/api/users/listUsers', function(req, res, next) {
        console.log("/api/users/listUsers");
        var Arr = new Array();
        var myUserList = [];
        var count = 0;
        User.find({
                "tipUser": "student"
            }, function(err, userList) {
                if (err) {
                    //console.log("err : " + err);
                    return next(err);
                }
                Class.find({
                    "user" : req.user_id
                }, function(err, classList) {
                    if (err) {
                        //console.log("Error while trying to find user.");
                    }
                    for(var i = 0 ; i <classList.length ; i++){
                        for(var t = 0; t<classList[i].registeredUsers.length ; t++){

                            for(var j = 0 ; j <userList.length ; j++){
                                if(("" + classList[i].registeredUsers[t]) == userList[j]._id){
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
                    //console.log("Arr is ",Arr)
                    res.json(myUserList);
                });
            });
    });

    app.get('/api/users/my_classes/:day', function(req, res, next) {
        console.log("/api/users/my_classes")
        console.log("req.body",req.params.day)
        console.log("req.user_id",req.user_id)
        Class.find({
            $or : [
                {"registeredUsers" : {$in : [req.user_id]}},
                {"user": req.user_id}
            ],
            day : req.params.day
        }, function(err, classList) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (classList) {
                console.log("classList",classList);
                res.json(classList);
            }
        });
    });



    app.get('/api/users/getSelectedUser/:user', function(req, res, next) {
        console.log("app get /users/getSelectedUser/:user : "); // + req.user)
        res.json(req.user);
    });


    app.put('/api/users/grades/delete', function(req, res, next) {
        console.log("app put /users/grades/delete")
        console.log(req.body)
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
                console.log("Error processing request. Cannot find user with this id with a events with this name.");
            } else if (gradeDeleted) {
                //console.log("grade has been found for this user. gradeDeleted successfuly : " + gradeDeleted);
                res.json(gradeDeleted);
            }
        });
    });

    app.put('/api/users/grades', function(req, res, next) {
        console.log("app put /users/grades")
        console.log("req.body",req.body)
        var flag = false;
        User.findOne({
            _id: req.body.user
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                if (user.grades.length == 0) {
                    var grade = new Grade();
                    grade.user = req.body.user;
                    grade.name = req.body.name;
                    grade.nota = req.body.nota;
                    grade.data = req.body.data;
                    console.dir(grade)
                    user.grades.push(grade); // Save the grade and also push the grade object in the user's grades array
                    user.save(function(err, user) {
                        if (err) {
                            return next(err);
                        }
                        res.json(grade); // Send the grade back to the caller
                    });
                } else {
                    if(req.body.tip == "exam"){
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
                            //console.log(">>>id : "  + user.grades[i]._id);
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

    app.put('/api/users/modifyAccessToUser/:user', function(req, res, next) {
        console.log("app put /grantAccessToUser/:user")
        /*console.log("req.user",req.user);
        console.log("req.body",req.body);*/
        Task.findOne({
            _id : req.body.id
        }, function(err, task){
            if(err){
                throw err;
            }
            if(task){
                //console.log("task found",task);
                var userAlreadyInserted = false;
                var registerUser = {
                    idUser : ''+req.user._id,
                    incercari : req.body.incercari,
                    lastAccessed : req.body.lastAccessed
                }
                    for(var j = 0; j<task.registeredUsers.length;j++){
                        //console.log("task.registeredUsers[j].idUser >> " + task.registeredUsers[j].idUser)
                        if(task.registeredUsers[j].idUser == ('' + req.user._id)){
                           // console.log("error, user already found in this array");
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
                   // console.log(registerUser);
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