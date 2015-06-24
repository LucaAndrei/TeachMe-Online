var User = require('../models/user');
var Task = require('../models/task');
module.exports = function(app, db) {

    app.get('/api/users/listAllUsers', function(req, res) {
        User.find({
            _id: {
                $ne: req.user_id
            }
        }, function(err, users) {
            if (err) {
                return next(err);
            } else if (users) {
                res.json(users);
            }
        });
    });

    app.get('/api/users/tasks', function(req, res) {
        Task.find({}, function(err, tasks) {
            if (err) {
                return next(err);
            } else if (tasks) {
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/exams', function(req, res, next) {
        Task.find({
            _id: {
                $in: ["Test_Radio", "Test_Check", "Test_Dnd"]
            },
            "registeredUsers.idUser": {
                $in: [req.user_id]
            }
        }, function(err, exams) {
            if (err) {
                return next(err);
            } else if (exams) {
                res.json(exams);
            }
        });
    });

    app.get('/api/users/homework', function(req, res, next) {
        Task.find({
            _id: {
                $in: ["Test_Radio_hw", "Test_Check_hw", "Test_DND_hw"]
            },
            "registeredUsers.idUser": {
                $in: [req.user_id]
            }
        }, function(err, homework) {
            if (err) {
                return next(err);
            } else if (homework) {
                res.json(homework);
            }
        });
    });

    app.get('/api/users/tasks_hw', function(req, res) {
        Task.find({
            _id: {
                $in: ["Test_Radio_hw", "Test_Check_hw", "Test_DND_hw"]
            },
        }, function(err, tasks) {
            if (err) {
                return next(err);
            } else if (tasks) {
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/tasks_exam', function(req, res) {
        Task.find({
            _id: {
                $in: ["Test_Radio", "Test_Check", "Test_Dnd"]
            },
        }, function(err, tasks) {
            if (err) {
                return next(err);
            } else if (tasks) {
                res.json(tasks);
            }
        });
    });

    app.get('/api/users/my_grades', function(req, res, next) {
        User.findOne({
            _id: req.user_id
        }, function(err, user) {
            if (err) {
                return next(err);
            } else if (user) {
                res.json(user.grades);
            }
        });
    });

    /*
    * Updates the current selected task when the user is accesing it.
    */
    app.put('/api/users/userAccessedTest', function(req, res) {
        Task.update({
            "_id": req.body.idTest,
            "registeredUsers.idUser": {
                $in: [req.user_id]
            }
        }, {
            $set: {
                "registeredUsers.$.lastAccessed": req.body.today
            },
            $inc: {
                "registeredUsers.$.incercari": 1
            }
        }, function(err, updated) {
            if (err) {
                return next(err);
            } else if (updated) {
                res.json(updated);
            }
        });
    });
};