var TopicModel = require('../models/TopicModel');
var config = require('../config/AppConfig');

/**
 * Add new topic 
 * @param {request} req - request 
 * @param {response} res - response
 * @returns topic object
 */
module.exports.addTopic = function (req, res) {
    var topic = new TopicModel({
        name: req.body.name,
        posts: req.body.post,
        comments: req.body.comment,
        images: req.body.images
    });
    TopicModel.addTopic(topic, (error, result) => {
        if (error) {
            return res.json({
                code: 604,
                success: false,
                message: 'Error While Creating topic.' + error.toString(),
                data: false
            });
        } else {
            return res.json({
                success: true,
                code: 602,
                message: 'Topic added Successfully.',
                data: result
            });
        }
    });
}


/**
 * post on topic
 * @param {Object} req -request 
 * @param {Object} res  - response
 * @returns topic object
 */
module.exports.post = function (req, res) {
    let images = [];
    if (req.files) {
        req.files.forEach(file => {
            images.push(file.filename);
        });
    }
    const updateFields = {
        name: 'post1',
        description: 'description',
        images: images,
        postedBy: req.user._id
    }
    TopicModel.post('617533747674040dccd40a16', updateFields, (err, post) => {
        if (post) {
            res.json({ success: true, data: post });
        }
    });
}


/**
 * comment on post
 * @param {Object} req -request 
 * @param {Object} res  - response
 * @returns object
 */
module.exports.comment = function (req, res) {
    postId = req.body.postId
    topicId = req.body.topicId
    const condition = {
        _id: topicId,
        "posts._id": postId
    };
    const updateFields = {
        comment: req.body.comment,
        commentedBy: req.user._id
    }
    TopicModel.post(condition, updateFields, (err, post) => {
        if (post) {
            res.json({ success: true, data: post });
        }
    });
}
/**
 * comment on post
 * @param {Object} req -request 
 * @param {Object} res  - response
 * @returns object
 */
module.exports.getTopics = function (req, res) {
    const page = req.query.page ? Number.parseInt(req.query.page) : 1;
    const limit = req.query.limit ? Number.parseInt(req.query.limit) : 10;
    TopicModel.getTopics({}, page, limit, (err, topics) => {
        if (topics) {
            res.json({ success: true, data: topics });
        } else {
            res.json({ success: false, data: err.toString() });
        }
    });
}