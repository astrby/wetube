const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: String,
    videoId: String,
},{collection: 'likes'});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;