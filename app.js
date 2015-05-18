// set up ======================================================================
// get all the tools we need
/*

MIDDLEWARE - FUNCTIE CARE SE APELEAZA LA FIECARE REQUEST
IN EXPRESS ESTE : APP.USE(FUNCTIE_MIDDLEWARE());

*/
var express  = require('express');
var app      = express();// Web framework to handle routing requests
var mongoose = require('mongoose');
//var passport = require('passport');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var MongoClient = require('mongodb').MongoClient;//Driver for connecting to MongoDB

var formidable = require('formidable'),
    util = require('util')
    fs   = require('fs-extra'),
    qt   = require('quickthumb');

var client = require('socket.io').listen(3000).sockets;

//var routes = require('./routes'); // Routes for our application

var path = require('path');
/*
MongoClient.connect('mongodb://127.0.0.1:27017/licentaDB', function(err, db) {
    "use strict";
    if(err) throw err;

    // configuration ===============================================================

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, 'public')));

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    app.use(express.bodyParser());

    // Application routes
    //routes(app, db);
mongoose.connect('mongodb://127.0.0.1/licentaDB');
var db = mongoose.connection;

        require('./routes/routes.js')(app, db); // load our routes and pass in our app and fully configured passport
        require('./routes/auth-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
        require('./routes/prof-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
        require('./routes/elev-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
        require('./routes/calendar-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
        require('./routes/class-routes.js')(app, db); // load our routes and pass in our app and fully configured passport



    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    app.listen(8080);
    console.log('The magic happens on port 8080');
});*/
    // configuration ===============================================================

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, 'public')));

    // Express middleware to populate 'req.cookies' so we can access cookies
    app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    //app.use(express.bodyParser());
    app.use(express.json()).use(express.urlencoded())

    // Application routes
    //routes(app, db);
    mongoose.connect('mongodb://127.0.0.1/licentaDB');
    var db = mongoose.connection;

    require('./routes/routes.js')(app, db); // load our routes and pass in our app and fully configured passport
    require('./routes/auth-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
    require('./routes/prof-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
    require('./routes/elev-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
    require('./routes/calendar-routes.js')(app, db); // load our routes and pass in our app and fully configured passport
    require('./routes/class-routes.js')(app, db); // load our routes and pass in our app and fully configured passport


        // catch 404 and forward to error handler
      /* app.use(function(req, res, next) {
            console.log("catch 404");
            console.log("req",req)
            var err = new Error('Not Found');
            err.status = 404;
            res.send('404 route not found');
            next(err);
        });*/

    client.on('connection',function(socket){
        console.log("client on connection");
        //console.log("socket",socket);
        socket.on('input',function(data){
            console.log("data",data);
            var whitespacePattern=/^\s*$/;
            if(whitespacePattern.test(data.mesaj)){
                //sendStatus('Name and message is required.');
                console.log("mesaj null");
            } else {
                console.log("try to push message")
                db.collection('chat').update({
                    'chatIDReceiver' : {$in : [data.chatIDReceiver, data.chatIDSender]},
                    'chatIDSender' : {$in : [data.chatIDReceiver, data.chatIDSender]}
                }, {
                    $push : {
                        'messages' : {numeSender : data.numeSender, mesaj : data.mesaj, sentAt : data.sentAt, msgIDSender : data.chatIDSender, msgIDReceiver : data.chatIDReceiver},
                    }
                },function(err, inserted) {
                    if(err) {
                        throw err;
                    }
                    console.log("inserted : ", inserted);
                    if(inserted == 0){
                        console.log("chat does not exist.create");
                        var messages = [{numeSender : data.numeSender, mesaj : data.mesaj, sentAt : data.sentAt, msgIDSender : data.chatIDSender, msgIDReceiver : data.chatIDReceiver}];
                        var initChat = {'chatIDReceiver' : data.chatIDReceiver, 'chatIDSender' : data.chatIDSender, 'messages' : messages};
                        db.collection('chat').insert(initChat, function (err, result) {
                            "use strict";
                            console.log("result inserted",result)
                        });
                    }
                    data['msgIDReceiver'] = data.chatIDReceiver;
                    data['msgIDSender'] = data.chatIDSender;
                                        console.log("data is ",data)

                    client.emit('output',[data])
                    //res.json(mClass);
                });
            }
        });

        socket.on('showHistory',function(data){
            console.log("data",data)
             db.collection('chat').findOne({
                    'chatIDReceiver' : {$in : [data.chatIDReceiver, data.chatIDSender]},
                    'chatIDSender' : {$in : [data.chatIDReceiver, data.chatIDSender]}
                },function(err, chat) {
                    if(err) {
                        console.log("err",err);
                    }
                    console.log("chat ",chat)
                    if(!chat || chat == null){
                        client.emit('history',[])
                    } else {
                        client.emit('history',{mesaje : chat.messages, chatIDSender : chat.chatIDSender, chatIDReceiver : chat.chatIDReceiver})
                    }
                });
        })

        socket.on('initLogin', function(data){
            console.log("init login!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            var cursor = db.collection('chat').find({
                    $or : [{'chatIDReceiver' : {$in : [data.userId]}}, {'chatIDSender' : {$in : [data.userId]}}]
                });
            cursor.each(function(err, doc){
                console.log("doc",doc)
                var found = false;
                if(doc != null){
                    if(doc.messages.length > 0){
                        for(var i = 0; i<doc.messages.length ; i++){
                            if(doc.messages[i].seenBy.length > 0){
                                console.log("i : " + i)
                                found = false;
                                for(var j = 0; j < doc.messages[i].seenBy.length ; j++){
                                    if(doc.messages[i].seenBy[j] == data.userId){
                                        //console.log("this message has not been seen by :" + data.userId)
                                        //console.log("message is : ", doc.messages[i])
                                        found = true;
                                    }
                                }
                            }
                            if(!found){
                                var messageNotSeen = {
                                    numeSender : doc.messages[i].numeSender,
                                    chatIDReceiver : doc.chatIDReceiver,
                                    chatIDSender : doc.chatIDSender,
                                    msgIDReceiver : doc.messages[i].msgIDReceiver,
                                    msgIDSender : doc.messages[i].msgIDSender,
                                    mesaj : doc.messages[i].mesaj,
                                    sentAt : doc.messages[i].sentAt
                                }
                                console.log("messageNotSeen ",messageNotSeen)
                                client.emit('offline',[messageNotSeen])
                            }
                        }
                    }
                }
            })
        })

        socket.on('seen', function(data){
            console.log("seen data : ",data)
            db.collection('chat').update({
                'chatIDReceiver' : {$in : [data.chatIDReceiver, data.chatIDSender]},
                'chatIDSender' : {$in : [data.chatIDReceiver, data.chatIDSender]},
                'messages' : {$elemMatch : {sentAt : data.seen}}
            }, {$addToSet : {"messages.$.seenBy" : data.seenBy}},function(err,updated){
                console.log("chat is ",updated)
            })
        })
    });




    app.listen(8080);
    console.log('The magic happens on port 8080');

module.exports = app;



















