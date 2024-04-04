const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String,
    profilePicture: String,
    verified: Boolean,
}, {collection: 'users'});

const User = mongoose.model('User', userSchema);

module.exports = User;