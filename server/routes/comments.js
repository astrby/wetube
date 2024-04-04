const express = require('express');
const Comment = require('../models/comment');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/get-comments', async(req,res)=>{
    const{videoId} = req.body;
    
    try{
        const comments = await Comment.find({videoId: videoId});
        
        if(comments){
            const userIds = [];
            
            comments.map((comment)=>{
                userIds.push(comment.userId);
            })

            const users = await User.find({'_id': {$in: userIds}});

            const responseComments = [];

            comments.map((comment)=>{
                users.map((user)=>{
                    if(comment.userId === user._id.toString()){
                        responseComments.push({
                            userId: comment.userId,
                            username: user.username,
                            comment: comment.comment,
                            commentId: comment._id,
                            profilePicture: user.profilePicture,
                        });
                    }
                })
            })
            
            return res.json(responseComments);
        }
    }catch(err){
        return res.json(err);
    }
})

router.post('/post-comment', verifyJWT, async(req,res)=>{
    const{comment, videoId, userId} = req.body;
    
    try{
        const commentDB = new Comment({
            comment: comment,
            videoId: videoId,
            userId: userId
        })
        await commentDB.save()
        .then(
            res.json({success: 'successPostComment'})
        );

    }catch(err){
        return res.send(err);
    }
})

router.post('/delete-comment', verifyJWT, async(req,res)=>{
    const{commentId} = req.body;

    try{
        await Comment.deleteOne({_id: commentId})
        .then(
            res.json({success: 'successDeleteComment'})
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