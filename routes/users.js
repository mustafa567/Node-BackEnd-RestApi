


var express = require('express');
var users = express.Router();

var jwt = require("jwt-simple");
var auth = require("../auth.js")();
var cfg = require("../config/db.js");
var User = require('../model/user.js');


users.get("/user",auth.authenticate(), function (req, res) {

var id='586dc24970012d2594eee2fe';
    console.log('dasdasdadas');
    // User.getUserById(id, function (err, userobj) {
    //     res.json(userobj);
    // });
});



module.exports = users;