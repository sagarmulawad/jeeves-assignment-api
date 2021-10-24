var UserModel = require('../models/UserModel');


var MailSender = require('../utils/MailSender');
const jwt = require('jsonwebtoken');
var config = require('../config/AppConfig');
/**
 * Add new user 
 * @param {request} req - request 
 * @param {response} res - response
 * @returns user object
 */
module.exports.addUser = function (req, res) {
    var user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role ? req.body.role : 'USER',
        isActive: true,
        username: req.body.username,
        password: req.body.password,
    });
    var message = {};
    var data1 = {};
    data1.data = '<html>  <h3>Welcome to Jeeeves</h3>'
        + '<p>Your registration is success<b>'
        +
        "</b><p>Please login with username and password used while registering</p></html>";
    data1.alternative = true;
    message = {
        text: "<h1>Hi</h5>",
        from: "sagar.mulawad@gmail.com",
        to: user.email,
        cc: "",
        subject: "Registration Successful...",
        attachment: [
            data1
        ]
    };
    // } 
    var condition = {};
    condition.$or = [{
        username: req.body.username.toLowerCase()
    }, {
        email: req.body.email.toLowerCase()
    }];
    UserModel.checkUser(condition, (err1, existUser) => {
        if (err1) {
            return res.json({
                success: false,
                code: 604,
                message: 'error while finding user' + err1.toString(),
                data: false
            });

        } else if (!existUser) {
            if (user.password.length <= 5) {
                return res.json({
                    code: 604,
                    success: false,
                    message: 'Password should be >= 6 characters',
                    data: 'Your Entered Password is:' + user.password
                });
            }
            UserModel.addUser(user, (error, result) => {
                if (error) {
                    return res.json({
                        code: 604,
                        success: false,
                        message: 'Error While Creating New User Either User Already Exists or Something Went Wrong.' + error.toString(),
                        data: false
                    });
                } else {
                    MailSender.sendMail(message);
                    return res.json({
                        success: true,
                        code: 602,
                        message: 'User Registered Successfully.',
                        data: prepareUserRes(result)
                    });
                }
            });
        } else {
            return res.json({
                success: true,
                code: 603,
                message: 'User Already Registered',
                data: prepareUserRes(existUser)
            });
        }
    });
}


/**
 * authenticate user
 * @param {Object} req -request 
 * @param {Object} res  - response
 * @returns user object & jwt
 */
module.exports.authenticate = function (req, res) {
    var condition = {};
    var username = req.body.username
    var regex = username.toLowerCase();
    condition.$or = [{
        email: regex
    }, {
        username: regex
    }];
    UserModel.checkUser(condition, (err, user) => {
        return authenticateUser(req, res, err, user);
    });
}

/**
 * 
 * @param {Request} req -request 
 * @param {Response} res -response
 * @param {Error} err -error object
 * @param {User} user - User object
 * @returns jwt token & user object
 */
var authenticateUser = function (req, res, err, user) {
    if (err) {
        return res.json({
            success: false,
            code: 604,
            message: 'error while finding user',
            data: err.toString()
        });
    }
    if (!user) {
        return res.json({
            success: false,
            code: 601,
            message: 'User not found.'
        });
    } else if (user.isDeleted) {
        return res.json({
            success: false,
            code: 605,
            isDeleted: true,
            message: 'User account is been blocked'
        });
    } else if (!user.isActive) {
        return res.json({
            success: false,
            code: 604,
            inactive: true,
            message: 'User account is not active',
            data: {
                "_id": user._doc._id,
                "name": user._doc.name,
            }
        });
    } else {
        UserModel.comparePassword(req.body.password, user.password, (err, isMatch) => {
            if (err) {
                return res.json({
                    success: false,
                    code: 606,
                    message: 'error while comparing password',
                    data: err.toString()
                });
            }
            if (isMatch) {
                const token = jwt.sign({ _id: user._id }, config.application.secret, {
                    expiresIn: 604800 //1 week
                });
                return res.json({
                    success: true,
                    token: 'Bearer ' + token,
                    code: 602,
                    message: 'User Logged in successfully.',
                    user: {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                return res.json({
                    success: false,
                    code: 603,
                    message: 'Password Incorrect.'
                });
            }
        });
    }
}
/**
 * Get user by Id (without isDeleted flag)
 * @param {Request} req 
 * @param {Response} res 
 * @returns User object
 */
module.exports.getUser = function (req, res) {
    var condition = {};
    // condition.isDeleted = false;
    if (req.body.id) {
        condition._id = req.body.id;
    }
    if (req.body.username) {
        condition.username = req.body.username;
    }
    if (req.body.email) {
        condition.email = req.body.email;
    }
    UserModel.checkUser(condition, (err, user) => {
        if (err) {
            res.json({
                success: false,
                code: 604,
                message: 'error while getting user',
                data: err.toString()
            });
        } else if (!user) {
            res.json({
                success: false,
                code: 603,
                message: 'No user found',
                data: user
            });
        } else {
            //.info('User found successfully in get user', { user: req.body.email })
            res.json({
                success: true,
                code: 602,
                message: 'User found successfully',
                data: prepareUserRes(user)
            });
        }
    });
}
var prepareUserRes = function (user) {
    delete user._doc.password;
    delete user._doc.createdAt;
    delete user._doc.updatedAt;
    delete user._doc.isDeleted;
    return user._doc;
}