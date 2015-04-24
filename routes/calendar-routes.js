// app/routes.js
var User = require('../models/user');
var Task = require('../models/task');
var Subject = require('../models/subject');
var Class = require('../models/class');
var Grade = require('../models/grade');
var Event = require('../models/event');
var Message = require('../models/message');
module.exports = function(app, passport) {

    app.get('/calendar/:user', function(req, res, next) {
        // This get is used when the 'teacher' wants to list the grades for a specific user.
        // First, the app.param('user', [...]) is called, to find the user by his id
        // Then, this get is called and the json that will be sent back will be populated with the users, received as parameter [/:user], tasks
        //console.log("specific calendar : " + req.user.events)
        User.findOne({
            _id : req.user._id
        }, function(err, user){
            if(err){
                throw err;
            } else if (user){
                res.json(user.events);
            }
        })
    });

    app.put('/users/events/delete/:user', function(req, res, next) {
        console.log("app put /users/events/delete/"+req.user._id + " with event id : " + req.body.eventId)
        console.log(req.user._id)
        User.update({
            _id: req.user._id
        }, {
            $pull: {
                "events": {
                    "_id": req.body.eventId
                }
            }
        }, function(err, deleted) {
            if (err) {
                //console.log("Error processing request. Cannot find user with this id with a events with this name.");
            } else if (deleted) {
                //console.log("events has been found for this user. eventDeleted successfuly");
                res.send("Event deleted");
            }
        });
    });

    app.put('/users/events/:user', function(req, res, next) {
        console.log("app put /users/events/:user")
        var event = new Event();
        event.user = req.user;
        event.title = req.body.title;
        event.start = req.body.start;
        event.end = req.body.end;

        User.update({
            _id: req.user._id
        },{
            $push : {
                "events" : event
            }
        }, function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                console.log("inserted : ",inserted);
                res.json(event);
            }
        });
    });

};