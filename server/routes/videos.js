const express = require('express');
const Video = require('../models/video');
const User = require('../models/user');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/get-videos', async(req,res)=>{
    try{
        const videos = await Video.find();
        if(videos){
            const videosList = [];
            await Promise.all(
                videos.map(async(video)=>{
                    await User.findById(video.userId)
                    .then((user)=>{
                        videosList.push({
                            _id: video._id,
                            videoName: video.videoName,
                            videoUrl: video.videoUrl,
                            username: user.username,
                            userId: user._id,
                        })
                    })
                })
            )
            return res.json(videosList)
        }else{
            return res.json('No videos found')
        }
    }catch(err){
        return res.json(err)
    }
})

router.post('/upload-video', verifyJWT, async(req,res)=>{
    const{videoName, videoDescription,userId} = req.body;

    try{
        const videoDB = new Video({
            videoName: videoName,
            videoDescription: videoDescription,
            videoUrl: '',
            userId: userId
        })
        await videoDB.save()
        .then(
            res.json({videoId: videoDB._id})
        )
    }catch(err){
        return res.json(err);
    }
})

router.post('/upload-video-url', async(req,res)=>{
    const{videoId, videoUrl}= req.body;
    
    try{
        await Video.updateOne(
            {_id: videoId, },
            {$set: {videoUrl: videoUrl}},
            {upsert: true},
        )
        .then(
            res.json({success: 'successfulVideoUpload'})
        )
    }catch(err){
        return res.json(err)
    }
})

router.post('/get-video', async(req,res)=>{
    const{videoId} = req.body;

    try{
        const video = await Video.findById(videoId);
        return res.json(video);

    }catch(err){
        return res.json(err)
    }
})

router.post('/get-search-videos', async(req,res)=>{
    const{searchQuery} = req.body;

    try{
        const videos = await Video.find({
            videoName:{
                $regex: searchQuery, $options: 'i'
            }
        });

        if(videos.length>0){
            res.json(videos)
        }else{
            res.json({})
        }
    }catch(err){
        return res.json(err);
    }
})

router.post('/get-my-videos', verifyJWT, async(req,res)=>{
    const{userId} = req.body;

    try{
        const videos = await Video.find({userId: userId});

        if(videos){
            res.send(videos);
        }
    }catch(err){
        res.json(err);
    }
})

router.post('/delete-video', verifyJWT, async(req,res)=>{
    const{videoId} = req.body;
    try{ 
      
        await Video.deleteOne({_id: videoId})
        .then(
            await Comment.deleteMany({videoId: videoId})
            .then(
                res.send({success: 'successfulVideoDelete'})
            )
        )
    }catch(err){
        res.json(err);
    }
})

router.post('/edit-video', verifyJWT, async(req,res)=>{
    const{videoId, videoName, videoDescription} = req.body;

    try{
        await Video.updateOne(
            {
                _id: videoId,
            },
            {
                videoName: videoName,
                videoDescription: videoDescription,
            },
            {
                upsert: true,
            }
        )
        .then(
            res.json({success: 'successfulVideoEdited'})
        )
    }catch(err){
        res.json(err);
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