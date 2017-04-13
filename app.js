var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dbconfig = require('./config/db');
var auth = require("./auth.js")();  

mongoose.connect(dbconfig.database);
var db = mongoose.connection;



var routes = require('./routes/route');
var users = require('./model/user');

// Init App
var app = express();



// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(auth.initialize());


// Express Session
app.use(session({
  secret: dbconfig.secret,
  saveUninitialized: true,
  resave: true
}));



// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


var routes = require('./routes/route');
var users_router = require('./routes/users');
app.use('/api', routes);
app.use('/api/users', users_router);

// Set Port
app.set('port', (process.env.PORT || 3003));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});