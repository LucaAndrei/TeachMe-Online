var User = require('../models/user');
var Event = require('../models/event');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function(app, db) {

    app.get('/api/users/calendar', function(req, res, next) {
        User.findOne({
            _id: req.user_id
        }, function(err, user) {
            if (err) {
                throw err;
            } else if (user) {
                res.json(user.events);
            }
        })
    });

    app.put('/api/users/events', function(req, res, next) {
        var event = new Event();
        event.title = req.body.title;
        event.start = req.body.start;
        event.end = req.body.end;
        if (req.body.descriere != "") {
            event.descriere = req.body.descriere;
        } else {
            event.descriere = "";
        }

        User.update({
            _id: req.user_id
        }, {
            $push: {
                "events": event
            }
        }, function(err, inserted) {
            if (err) {
                throw err;
            } else if (inserted) {
                res.json(event);
            }
        });
    });

    app.put('/api/users/events/delete', function(req, res, next) {
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
                // Error processing request. Cannot find user with this id with an event with this id.
            } else if (deleted) {
                res.send("Event deleted");
            }
        });
    });
};