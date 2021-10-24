var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validators = require('../utils/Validators');
var Schema = mongoose.Schema;

// create a schema
var UserSchema = new Schema({
	name: {
		type: String,
		default: null
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: 'Email address is required',
		validate: [validators.email, 'Please fill a valid email address'],
	},
	username: {
		type: String,
		trim: true,
		unique: true,
		lowercase: true,
		required: 'username is required',

	},
	password: {
		type: String,
		required: 'password field is required'
	},
	role: {
		type: String,
		enum: ['USER', 'ADMIN'],
		default: 'USER'
	},
	isActive: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
}, {
	versionKey: false
});

// the schema is useless so far
// we need to create a model using it
const User = module.exports = mongoose.model('User', UserSchema);


/**
 * add new User
 * @param {Object} newUser 
 * @param {Object} callback 
 */
module.exports.addUser = function (newUser, callback) {
	// newUser.token  = bcrypt.hashSync(newUser.email, 10);
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save(callback);
		});
	});

}

/**
 * check user exists or not
 * @param {Object} condition 
 * @param {Object} callback
 * @returns user based on condition 
 */
module.exports.checkUser = function (condition, callback) {
	User.findOne(condition, callback);
}

module.exports.getById = function (id, callback) {
	User.findOne({
		_id: id
	}, callback);
}
module.exports.getSingleUser = async function (condition) {
	return await User.findOne(condition);
}
/**
 * compare entered password with hash 
 * @param {String} candidatePassword 
 * @param {String} hash 
 * @param {Object} callback 
 * @returns true if password matches 
 */
module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
};