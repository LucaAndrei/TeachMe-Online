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

    app.get('/api/users/exams', function(req, res, next) {
        console.log("/api/users/exams")
        Task.find({
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


    app.put('/api/users/userAccessedTest', function(req, res, next) {
        console.log("/api/users/userAccessedTest")
        Task.update({
            "_id" : req.body.idTest,
            "registeredUsers.idUser" : {$in : [req.user_id]}
        }, {
            $set : {
                "registeredUsers.$.lastAccessed" : req.body.today
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