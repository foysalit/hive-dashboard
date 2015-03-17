var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); // driver: mongodb://<dbuser>:<dbpassword>@ds035250.mongolab.com:35250/hive


var routes = require('./routes/index');
var users = require('./routes/users');

//required for login
var session = require('express-session');// adding session cookies
var passport = require('passport'); // grab passport
//route for github
var github = require('./routes/github');
var join = require('./routes/join');
var login = require('./routes/login');
var command = require('./routes/command');
var robots = require('./routes/robots');
var app = express();
// Connectio sting                              this is mongolab URL PORT   DB Name
mongoose.connect("mongodb://phillip:wunderMe2@ds035250.mongolab.com:35250/hive")


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));

// tell express session to save session start
app.use(session({
    resave:true,
    Uninitialized:true,
    secret:'test'
}));
app.use(passport.initialize());//start passport
app.use(passport.session()); // persistent login sessions


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var authRequired =function(req,res,next){
    if(!req.session.userInfo){
        res.redirect('/');
        res.status(401).end();
    }else{
        next();
    }
}
app.use('/github',authRequired);
app.use('/github',github);
app.use('/join', join);
app.use('/login', login);
app.use('/command', command);
app.use('/robots', robots);

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


module.exports = app;
