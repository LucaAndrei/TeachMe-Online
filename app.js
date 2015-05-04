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
       app.use(function(req, res, next) {
            console.log("catch 404");
            var err = new Error('Not Found');
            err.status = 404;
            res.send('404 route not found');
            next(err);
        });



    app.listen(8080);
    console.log('The magic happens on port 8080');

module.exports = app;



















