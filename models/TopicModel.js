var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validators = require('../utils/Validators');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

// create a schema
var TopicSchema = new Schema({
    name: {
        type: String,
        default: null,
        required: true
    },
    posts: [{
        name: { type: String },
        description: { type: String },
        images: [{ type: String }],
        comments: [{
            comment: { type: String },
            commentedBy: { type: objectId, ref: 'User' }
        }],
        postedBy: { type: objectId, ref: 'User' }
    }],
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
TopicSchema.plugin(mongoosePaginate);
// the schema is useless so far
// we need to create a model using it
const Topic = module.exports = mongoose.model('Topic', TopicSchema);


module.exports.addTopic = function (newTopic, callback) {
    newTopic.save(callback);
}

module.exports.post = function (id, updateFields, callback) {
    Topic.findByIdAndUpdate(id, { $push: { posts: updateFields } }, callback);
}
module.exports.post = function (condition, updateFields, callback) {
    Topic.findOneAndUpdate(condition, { $push: { "posts.$.comments": updateFields } }, callback);
}
module.exports.getTopics = function (condition, page, limit, callback) {
    Topic.paginate(condition, { page: page, limit: limit, populate: { path: 'posts.comments.commentedBy', select: 'name' }, lean: true }, callback)
}