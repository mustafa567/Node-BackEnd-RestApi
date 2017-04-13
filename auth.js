var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./model/user.js");
var cfg = require("./config/db.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function () {
    var strategy = new Strategy(params, function (payload, done) {
        console.log(payload.id);
        var userobj = users.getUserById(payload.id, function (err, user) {

            console.log("the user is " + userobj);
            if (userobj) {
                return done(null, {
                    id: userobj.id
                });
            } else {
                return done(new Error("User not found"), null);
            }
        })
    });
    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};