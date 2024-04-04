const mongoose = require('mongoose');
const { collection } = require('./user');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    videoName: String,
    videoDescription: String,
    videoUrl: String,
    userId: String
},{collection: 'videos'});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;