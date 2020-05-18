var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var flash = require('connect-flash');
// session = require("express-session");
// bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Authentication
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport');
const configPassport = require('./config/passport');
configPassport(passport);

const MONGODB_URI = 'mongodb://localhost/ENACT';
const mongoose = require('mongoose');

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo connected")
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// register middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: false,
// }));

// Register passport middleware
// app.use(flash());
app.use(passport.initialize(1));
app.use(passport.session(1));
// app.use(bodyParser.urlencoded({extended: false}));

// ask for authentication
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// google returns authorized back to the URL below
app.get('/login/authorized',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/error'
    })
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;