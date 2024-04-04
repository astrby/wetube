const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: String,
    videoId: String,
    userId: String
},{collection: 'comments'});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;