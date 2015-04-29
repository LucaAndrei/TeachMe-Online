// app/routes.js
var User = require('../models/user');
var Event = require('../models/event');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, db) {

    app.get('/api/users/calendar', function(req, res, next) {
        User.findOne({
            _id : req.user_id
        }, function(err, user){
            if(err){
                throw err;
            } else if (user){
                res.json(user.events);
            }
        })
    });

    app.put('/api/users/events/delete', function(req, res, next) {
        console.log("app put /users/delete/"+req.user_id + " with event id : " + req.body.eventId)
        //console.log(req.user_id)
        User.update({
            _id: req.user_id
        }, {
            $pull: {
                "events": {
                    "_id": new ObjectId(req.body.eventId)
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

    app.put('/api/users/events', function(req, res, next) {
        console.log("app put /events/:user")
        var event = new Event();
        event.title = req.body.title;
        event.start = req.body.start;
        event.end = req.body.end;

        User.update({
            _id: req.user_id
        },{
            $push : {
                "events" : event
            }
        }, function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                //console.log("inserted : ",inserted);
                res.json(event);
            }
        });
    });
};