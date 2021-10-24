var passport = require('passport');
var passportJWT = require('passport-jwt');
const User = require('../models/UserModel');
const cfg = require('../config/AppConfig');

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
	secretOrKey: cfg.application.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function () {
	var strategy = new Strategy(params, function (jwt_payload, done) {

		User.getById(jwt_payload._id, (err, user) => {
			if (err) {
				return done(err, false);
			}
			if (!user || user.isDeleted || !user.isActive) {
				return done(null, false);
			} else {
				delete user._doc.password;
				delete user._doc.createdAt;
				delete user._doc.updatedAt;

				return done(null, user);
			}
		});
	});
	passport.use(strategy);
};