const express = require('express');
const Like = require('../models/like')
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/get-user-reaction', async(req,res)=>{
    const{userId, videoId} = req.body;
    
    try{
        const like = await Like.find({
            userId: userId,
            videoId: videoId,
        });
    
        if(like.length>0){
            res.send({reaction: true})
        }else{
            res.send({reaction: false})
        }
    }catch(err){
        return res.send(err)
    }
})

router.post('/get-reactions-number', async(req,res)=>{
    const{videoId} = req.body;

    try{
        const likes = await Like.find({videoId: videoId});

        if(likes){
            res.json({reactionsNumber: likes.length})
        }
    }catch(err){
        return res.json(err);
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

router.post('/user-reaction', verifyJWT, async(req,res)=>{
    const{videoId, userId, reaction} = req.body;

    try{
        if(reaction === false){
            await Like.deleteOne({
                videoId: videoId,
                userId: userId,
            }).then(
                res.json('success')
            )
        }else if(reaction === true){
            await Like({
                videoId: videoId,
                userId: userId,
            }).save()
            .then(
                res.json('success')
            )
        }
    }catch(err){
        return res.send(err)
    }
})

module.exports = router;