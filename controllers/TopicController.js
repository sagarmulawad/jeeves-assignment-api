var express = require('express');
var router = express.Router();
const passport = require('passport');
var TopicService = require('../services/TopicService');
const multer = require('multer');

const MIME_TYPE = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg'
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, "upload-files");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.split('.').slice(0, -1).join('.');
        const ext = MIME_TYPE[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    },
    onError: function (err, next) {
        console.log('error' + err);
        next(err);
    }
});
// register new user
router.post('/add', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    try {
        return TopicService.addTopic(req, res);
    } catch (err) {
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});
router.post('/post', passport.authenticate('jwt', {
    session: false
}), multer({ storage: storage }).array("thumbnails", 5), function (req, res) {
    try {
        return TopicService.post(req, res);
    } catch (err) {
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});
router.post('/comment', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    try {
        return TopicService.comment(req, res);
    } catch (err) {
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});
router.get('/topic', passport.authenticate('jwt', {
    session: false
}), function (req, res) {
    try {
        return TopicService.getTopics(req, res);
    } catch (err) {
        res.json({
            success: false,
            code: 604,
            message: err.toString()
        });
    }

});

module.exports = router;