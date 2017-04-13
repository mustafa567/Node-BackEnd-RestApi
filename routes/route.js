
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require("jwt-simple");  
var auth = require("../auth.js")();  
var cfg = require("../config/db.js");  
var User = require('../model/user.js');



// Get Homepage
// router.get('/', ensureAuthenticated, function(req, res){
// 	res.render('index');
// });

// function ensureAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		res.redirect('/users/login');
// 	}
// }



// Register
router.get('/register', function (req, res) {
	res.send('api working');
});

// Login
router.get('/login', function (req, res) {
	res.send('api login working');
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.send({
			errors: errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function (err, user) {
			if (err) throw err;
			console.log(user);
		});

		// req.flash('success_msg', 'You are registered and can now login');

		res.send({ newUser });
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {

		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, {
						id: user.id
					});
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local'),
	function (req, res) {

		if (req.user) {
			var payload = {
				id: req.user.id
			};
			var token = jwt.encode(payload, cfg.jwtSecret);
			res.json({
				user:req.user.id,
				token: token
			});
		}
	});

router.get('/logout', function (req, res) {
	req.logout();

	res.json('logout successful');
});

module.exports = router;