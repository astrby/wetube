const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.SERVER_PORT;
const mongoose = require('mongoose');

const videoRoute = require('./routes/videos')
const userRoute = require('./routes/users');
const reactionRoute = require('./routes/reactions');
const commentRoute = require('./routes/comments');
const subscriptionsRoute = require('./routes/subscriptions');

const dbName = process.env.DB_NAME;
const dbAdmin = process.env.DB_ADMIN;
const dbPassword = process.env.DB_PASSWORD;
const dbUri = `mongodb+srv://${dbAdmin}:${dbPassword}@cluster0.qy7pbul.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect(dbUri)
.then(console.log('Database connected succesfully'))
.catch((err)=>{
    console.log(err);
})

app.use('/api/users', userRoute);
app.use('/api/videos', videoRoute);
app.use('/api/reactions', reactionRoute);
app.use('/api/comments', commentRoute);
app.use('/api/subscriptions', subscriptionsRoute);

app.listen(port, ()=>{
    console.log('Server running on port '+port);
})