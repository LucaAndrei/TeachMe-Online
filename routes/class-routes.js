// app/auth-routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, db) {

    app.get('/listClasses/:user', function(req, res, next) {
        console.log("/listClasses");
        console.log("req.user : ",req.user)
        // Search through the User model all the objects that have the property 'tipUser : student'
        Class.find({
            user : req.user._id
        }, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            //console.log("userList : " + userList);
            res.json(classList);
        });
    });

    app.get('/listAllClasses', function(req, res, next) {
        console.log("/listClasses");
        // Search through the User model all the objects that have the property 'tipUser : student'
        Class.find({}, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            //console.log("classList : " + classList);
            res.json(classList);
        });
    });

    app.post('/addClass/:user', function(req, res, next) {
        console.log("app post /addClass")
            //console.log("req.user : " + req.user);
            console.log("req.body : ",req.body);
            console.log("req user",req.user)
            {
                // Create a new Class object based on the Class model. Set the properties received from the request.
                var mClass = new Class();
                mClass.subject = req.body.subject;
                mClass.credite = req.body.credite;
                mClass.tipExam = req.body.tipExam;
                mClass.room = req.body.room;
                mClass.day = req.body.day;
                mClass.start_time = req.body.start_time;
                mClass.end_time = req.body.end_time;
                mClass.teacher = req.body.teacher;
                mClass.descriere = req.body.descriere;
                mClass.user = req.user._id;
                mClass.registeredUsers = req.body.registeredUsers;

                console.dir(mClass)
            }

        mClass.save(function(err, mClass) {
            if (err) {
                return next(err);
            } else {
                console.log("class save : ",mClass);
                res.json(mClass)
            }

        });
    });

    app.post('/addSubject', function(req, res) {
        console.log("app post /addSubject")
        console.log("req.body",req.body)
        db.collection('subjects').insert({subject_name : req.body.name,user : req.body.userId}, function(err, inserted) {
            if(err) {
                throw err;
            }
            console.log("inserted : ", inserted);
            res.json(inserted);
        });
    });


    app.put('/deleteClass', function(req, res) {
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

     app.get('/registeredClasses/:user', function(req,res,next){
        console.log("/registeredClasses/"+req.user._id)
        Class.find({
            "registeredUsers.idUser" : {$in : [req.user._id]}
        }, function(err, classList) {
            if (err) {
                //console.log("err : " + err);
                return next(err);
            }
            console.log("classList : " + classList);
            res.json(classList);
        });
     })

    app.post('/registerClass/:user', function(req, res,next) {
        console.log("app post /registerClass/" + req.user._id)
        Class.update({
            _id: req.body.class_id
        },{
            $push : {
                "registeredUsers" : req.user._id
            }
        },function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                console.log("registered correctly")
                res.json(inserted);
            }
        });
    });
};
