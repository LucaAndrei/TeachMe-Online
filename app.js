// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var path = require('path');

//var routes = require('./routes/index');
//var users = require('./public/javascripts');

// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database
mongoose.connect('mongodb://127.0.0.1/licentaDB');
var db = mongoose.connection;
require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(bodyParser());
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


//app.use(session({ secret: 'myAppSecret' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/auth-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/prof-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/elev-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/calendar-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/class-routes.js')(app, db); // load our routes and pass in our app and fully configured passport


// launch ======================================================================


//app.use('/', routes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(port);
console.log('The magic happens on port ' + port);

module.exports = app;
