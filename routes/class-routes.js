// app/auth-routes.js
var Subject = require('../models/subject');
var Class = require('../models/class');
module.exports = function(app, db) {

    app.get('/api/users/listClasses', function(req, res, next) {
        console.log("/api/users/listClasses");
        console.log("req.user : ",req.user)
        // Search through the User model all the objects that have the property 'tipUser : student'
        Class.find({
            user : req.user_id
        }, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            //console.log("userList : " + userList);
            res.json(classList);
        });
    });

    app.get('/api/users/listAllClasses', function(req, res, next) {
        console.log("/api/users/listAllClasses");
        Class.find({}, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            //console.log("classList : " + classList);
            res.json(classList);
        });
    });

    app.post('/api/users/addClass', function(req, res, next) {
        console.log("app post /addClass")
        //console.log("req.user : " + req.user);
        //console.log("req.body : ",req.body);
        //console.log("req user",req.user)
        // Create a new Class object based on the Class model. Set the properties received from the request.
        var mClass = {
            subject : req.body.subject,
            credite : req.body.credite,
            tipExam : req.body.tipExam,
            room : req.body.room,
            day : req.body.day,
            start_time : req.body.start_time,
            end_time : req.body.end_time,
            teacher : req.body.teacher,
            descriere : req.body.descriere,
            user : req.user_id,
            registeredUsers : req.body.registeredUsers
        }

        //console.log(mClass)

        db.collection('classes').insert(mClass, function(err, inserted) {
            if(err) {
                throw err;
            }
            //console.log("inserted : ", inserted);
            res.json(mClass);
        });
    });

    app.post('/api/users/addSubject', function(req, res) {
        console.log("app post /addSubject")
        //console.log("req.body",req.body)
        db.collection('subjects').insert({subject_name : req.body.name,user : req.body.userId}, function(err, inserted) {
            if(err) {
                throw err;
            }
            //console.log("inserted : ", inserted);
            res.json(inserted);
        });
    });

    app.get('/api/users/listSubjects', function(req, res, next) {
        console.log("/listUsers");
        // Search through the User model all the objects that have the property 'tipUser : student'
        Subject.find({}, function(err, subjectList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            //console.log("subjectList : " + subjectList);
            res.json(subjectList);
        });
    });


    app.put('/api/users/deleteClass', function(req, res) {
        console.log("app put /deleteClass")
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

     app.get('/api/users/registeredClasses/:user', function(req,res,next){
        console.log("/registeredClasses/"+req.user._id)
        Class.find({
            "registeredUsers" : {$in : [req.user._id]}
        }, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            console.log("classList : " + classList);
            res.json(classList);
        });
     })

    app.post('/api/users/registerClass', function(req, res,next) {
        console.log("app post /registerClass/" + req.user_id)
        Class.update({
            _id: req.body.class_id
        },{
            $push : {
                "registeredUsers" : req.user_id
            }
        },function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                //console.log("registered correctly")
                res.json(inserted);
            }
        });
    });
};
