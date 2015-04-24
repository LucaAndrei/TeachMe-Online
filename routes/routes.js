// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, db) {

    app.use('/api',function(req,res, next){
        console.log("is logged in middleware");
        var session_id = req.cookies.session;
        if(!session_id){
            console.log("session is not set");
            //return res.redirect('/');
            //console.log("next",next);
            //return next(new Error("forbidden"));
            return res.send("Hello world")
        }
        console.log("req.cookies.session",req.cookies.session);
        db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
            "use strict";

            /*if (err){
                console.log("session findone err",err);
            }

            if (!session) {
                console.log("session not found");
                return next();
            }*/

            if (!err && session) {
                console.log("req.username",session.username);
                req.username = session.username;
                req.user_id = session.user_id;
                req.myTest = "myTestasdfg";
                return next();
            }

        });
    });

    app.get("/cookie",function(req,res, next){
       console.log("cookie /cookie");
       console.log("req.cookies",req.cookies)
        var session_id = req.cookies.session;
        if(session_id){
            console.log("/cookie req.cookies.session",req.cookies.session);
            db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
                "use strict";

                if (err){
                    console.log("cookie session findone err",err);
                }

                if (!session) {
                    console.log("cookie session not found");
                    return next();
                }

                if (!err && session) {
                    console.log("cookie session.username",session.username);
                    User.findOne({_id : session.user_id},function(err,user){
                        if(err) {
                            console.log("err")
                        }
                        console.log(">>>>>>>.retuyrn the user")
                        res.json(user);
                    })
                }
                //return next();
            });
        } else {
            console.log("return");
            res.json();
        }
    });

    app.param('user', function(req, res, next, id) {
        //console.log("param user id: " + id);
        var query = User.findById(id);
        query.exec(function(err, user) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new Error("can't find user"));
            }
            //console.log("param user : " + user);
            req.user = user;
            return next();
        });
    });


    app.put('/api/users/updateUser', function(req, res, next) {
        console.log("req.body",req.body);
        User.update({
            _id: req.user_id
        }, {
            $set : {
                "nume" : req.body.nume,
                "prenume" : req.body.prenume,
                "email" : req.body.email
            }
        }, function(err, updated) {
            if (err) {
                //console.log("Error while trying to find user.");
            }
            console.log("found user. updating...",updated)
            res.json(updated);
        });
    });
};

