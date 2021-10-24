var express = require('express');
var router = express.Router();
const passport = require('passport');
var UserService = require('../services/UserService');

// register new user
router.post('/register', function (req, res) {
    try {
        return UserService.addUser(req, res);
    } catch (err) {
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});


// login 
/**
 * 
 * /users/authenticate:
 *   post:
 *     description: Login to the application
 *     tags: [Login]
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/username'
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *         
 */
router.post('/authenticate', function (req, res) {
    try {
        // console.log(Ab.data);
        return UserService.authenticate(req, res);
    } catch (err) {
        console.log(err.toString());
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});

module.exports = router;