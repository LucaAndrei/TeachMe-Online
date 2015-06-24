var Subject = require('../models/subject');
var Class = require('../models/class');
module.exports = function(app, db) {

    /*
    * List all classes
    */
    app.get('/api/users/listAllClasses', function(req, res, next) {
        Class.find({}, function(err, classList) {
            if (err) {
                return next(err);
            }
            res.json(classList);
        });
    });


    /*
    * Search through the Class model all the objects that have
    * the "user" property equal to the current logged in user's id
    */
    app.get('/api/users/listClasses', function(req, res, next) {
        Class.find({
            user: req.user_id
        }, function(err, classList) {
            if (err) {
                return next(err);
            }
            res.json(classList);
        });
    });


    /*
    * Create a new Class object based on the Class model.
    * Set the properties received from the request.
    */
    app.post('/api/users/addClass', function(req, res, next) {
        var mClass = {
            subject: req.body.subject,
            credite: req.body.credite,
            tipExam: req.body.tipExam,
            room: req.body.room,
            day: req.body.day,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            teacher: req.body.teacher,
            descriere: req.body.descriere,
            user: req.user_id,
            registeredUsers: req.body.registeredUsers
        }
        db.collection('classes').insert(mClass, function(err, inserted) {
            if (err) {
                throw err;
            }
            res.json(mClass);
        });
    });

    app.post('/api/users/addSubject', function(req, res) {
        db.collection('subjects').insert({
            subject_name: req.body.name,
            user: req.body.userId
        }, function(err, inserted) {
            if (err) {
                throw err;
            }
            res.json(inserted);
        });
    });

    app.get('/api/users/listSubjects', function(req, res, next) {
        Subject.find({}, function(err, subjectList) {
            if (err) {
                return next(err);
            }
            res.json(subjectList);
        });
    });


    app.put('/api/users/deleteClass', function(req, res) {
        Class.remove({
            _id: req.body.class_id
        }, function(err, removed) {
            if (err) {
                throw err;
            } else if (removed) {
                res.json(removed);
            }
        });
    });


    /*
    * Finds all the classes that for the selected user, added by the current logged in user
    */
    app.get('/api/users/registeredClasses/:user', function(req, res, next) {
        Class.find({
            "user": req.user_id,
            "registeredUsers": {
                $in: [req.user._id]
            }
        }, function(err, classList) {
            if (err) {
                return next(err);
            }
            res.json(classList);
        });
    })


    /*
    * Adds the current user's id to the RegisteredUsers array in the Class object
    */
    app.post('/api/users/registerClass', function(req, res, next) {
        Class.update({
            _id: req.body.class_id
        }, {
            $push: {
                "registeredUsers": req.user_id
            }
        }, function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                res.json(inserted);
            }
        });
    });
};
