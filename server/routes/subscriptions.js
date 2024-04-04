const express = require('express');
const User = require('../models/user');
const Subscription = require('../models/subscription');
const Video = require('../models/video');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/check-subscribed', verifyJWT, async(req,res)=>{
    const{userId, videoUserId} = req.body;

    try{

        const subscribed = await Subscription.find({
            userId: userId, 
            "subscribed.userId": videoUserId
        })
        if(subscribed.length>0){
            res.json({subscribed: true})
        }
    }catch(err){
        console.log(err)
    }
})

router.post('/subscribe', verifyJWT, async(req,res)=>{
    const{userId, videoUserId} = req.body;

    try{
        await Promise.all(
            [
                Subscription.updateOne(
                    {userId: userId},
                    {$push: {subscribed: {userId: videoUserId}}},
                ),
                 Subscription.updateOne(
                    {userId: videoUserId},
                    {$push: {subscribers: {userId: userId}}},
                )
            ]
        ) 
        .then(
            res.json({subscribed: true})
        )
    }catch(err){
        console.log(err)
    }
})

router.post('/unsubscribe', verifyJWT, async(req,res)=>{
    const{userId, videoUserId} = req.body;
    
    try{
        await Promise.all([
            Subscription.updateOne(
                {userId: userId},
                {$pull: {subscribed: {userId: videoUserId}}}
            ),
            Subscription.updateOne(
                {userId: videoUserId},
                {$pull: {subscribers: {userId: userId}}}
            )
        ]) 
        .then(
            res.json({subscribed: false})
        )
    }catch(err){
        console.log(err)
    }
})

router.post('/my-subscriptions', verifyJWT, async(req,res)=>{
    const{userId} = req.body;

    try{
        const subscriptions = await Subscription.findOne({userId: userId});
        if(subscriptions){

            const subscribed = [];

            subscriptions.subscribed.map((sub)=>{
                subscribed.push(sub.userId);
            })

            const videos = await Video.find({userId: {$in: subscribed }});
            const users = await User.find({_id: {$in: subscribed}});

            const updatedVideos = [];

            videos.map((video)=>{
                users.map((user)=>{
                    if(video.userId === user._id.toString()){
                        updatedVideos.push({
                            _id: video._id,
                            videoName: video.videoName,
                            videoUrl: video.videoUrl,
                            username: user.username,
                            userId: user._id,
                        })
                    }
                })
            })

            if(updatedVideos && users){
                res.send({
                    videos: updatedVideos,
                    users: users,
                })
            }
        }
    }catch(err){
        res.send(err)
    }
})

function verifyJWT(req,res, next){
    const token = req.headers['authorization'];

    jwt.verify(token, process.env.JWT_KEY, (err, tkn)=>{
        if(err){
            res.json(err)
        }else{
            next();
        }
    })
}

module.exports = router;
