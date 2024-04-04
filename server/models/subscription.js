const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    userId: String,
    subscribed: [{userId: String}],
    subscribers: [{userId : String}],

}, {collection: 'subscriptions'});

const Subscriptions = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscriptions;