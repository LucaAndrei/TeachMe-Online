// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
var formidable = require('formidable'),
    util = require('util')
    fs   = require('fs-extra');
module.exports = function(app, db) {


    app.use('/api',function(req,res, next){
        //console.log("is logged in middleware");
        var session_id = req.cookies.session;
        if(!session_id){
            //console.log("session is not set");
            res.status(404).send('Not found');
        } else {
            //console.log("req.cookies.session",req.cookies.session);
            db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
                "use strict";
                if (!err && session) {
                    req.user_id = session.user_id;
                    return next();
                }
            });
        }
    });




    app.get("/cookie",function(req,res, next){
       console.log("cookie /cookie");
       //console.log("req.cookies",req.cookies)
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
                    //return next();
                }

                if (!err && session) {
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
            console.log("no cookie.return");
            //res.status(404).send('Not found');
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




    app.post('/upload', function (req, res){
            console.log("/////////upload")
            console.log("req.user_id",req.user)
          var form = new formidable.IncomingForm();
          form.on('end', function(fields, files) {
            /* Temporary location of our uploaded file */
            console.log("this",this.openedFiles[0].path.split("/tmp/")[1])
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'public/images/uploads/';
            if(file_name == ""){
                console.log("file name is empty")
                var session_id = req.cookies.session;
                db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
                    "use strict";
                    User.update({_id : session.user_id},{
                        $set : {
                            "imgPath" : "images/uploads/dummyuser.png"
                        }
                    },function(err,updated){
                        if(err){
                            console.log("error finding user")
                        }
                        console.log("img path updated : "+ updated)
                        //console.log("user found",user)
                    })
                });
            } else {
                var session_id = req.cookies.session;
                db.collection('user_session').findOne({ '_id' : session_id }, function(err, session) {
                    "use strict";
                    var new_file_name = session.user_id + "_" + file_name;
                    fs.copy(temp_path, new_location + new_file_name, function(err) {
                      if (err) {
                        console.error(err);
                      } else {
                        console.log("success!")
                        User.update({_id : session.user_id},{
                            $set : {
                                "imgPath" : "images/uploads/"+new_file_name
                            }
                        },function(err,updated){
                            if(err){
                                console.log("error finding user")
                            }
                            console.log("img path updated : "+ updated)
                            //console.log("user found",user)
                        })
                      }
                    });
                });

            }
          });
          form.parse(req, function(err, fields, files) {
            console.log("here")
            res.redirect('/')
          });
    });




};

