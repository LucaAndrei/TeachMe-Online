// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
module.exports = function(app, db) {

    app.get('/api/users/tasks', function(req, res) {
        console.log("/api/users/tasks")
        Task.find({}, function(err, tasks) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (tasks) {
                console.log("tasks list",tasks);
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/listAllUsers', function(req, res) {
        console.log("/api/users/listAllUsers")
        User.find({
            _id : {$ne : req.user_id}
        }, function(err, users) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (users) {
                console.log("users list",users);
                res.json(users);
            }
        });
    });

    app.get('/api/users/tasks_hw', function(req, res) {
        console.log("/api/users/tasks_hw")
        Task.find({
            _id : {$in : ["Test_Radio_hw","Test_Check_hw","Test_DND_hw"]},
        }, function(err, tasks) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (tasks) {
                console.log("tasks list",tasks);
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/tasks_exam', function(req, res) {
        console.log("/api/users/tasks_exam")
        Task.find({
            _id : {$in : ["Test_Radio","Test_Check","Test_Dnd"]},
        }, function(err, tasks) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (tasks) {
                console.log("tasks list",tasks);
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/exams', function(req, res, next) {
        console.log("/api/users/exams")
        Task.find({
            _id : {$in : ["Test_Radio","Test_Check","Test_Dnd"]},
            "registeredUsers.idUser" : {$in : [req.user_id]}
        }, function(err, exams) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (exams) {
                console.log("exams found",exams);
                res.json(exams);
            }
        });
    });

    app.get('/api/users/homework', function(req, res, next) {
        console.log("/api/users/homework")
        Task.find({
            _id : {$in : ["Test_Radio_hw","Test_Check_hw","Test_DND_hw"]},
            "registeredUsers.idUser" : {$in : [req.user_id]}
        }, function(err, homework) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (homework) {
                console.log("homework found",homework);
                res.json(homework);
            }
        });
    });


    app.get('/api/users/my_grades', function(req, res, next) {
        console.log("/api/users/my_grades")
        User.findOne({
            _id: req.user_id
        }, function(err, user) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (user) {
                //console.log("user.grades",user.grades);
                res.json(user.grades);
            }
        });
    });

    app.put('/api/users/userAccessedTest', function(req, res) {
        console.log("/api/users/userAccessedTest")
        Task.update({
            "_id" : req.body.idTest,
            "registeredUsers.idUser" : {$in : [req.user_id]}
        }, {
            $set : {
                "registeredUsers.$.lastAccessed" : req.body.today
            },
            $inc : {
                "registeredUsers.$.incercari" : 1
            }
        },function(err, updated) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id.");
            } else if (updated) {
                //console.log("updated : " + updated);
                res.json(updated);
            }
        });
    });
};