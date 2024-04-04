const express = require('express');
const User = require('../models/user');
const Video = require('../models/video');
const Subscription = require('../models/subscription');
const {compare, encrypt} = require('../handleBcrypt')
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async(req,res)=>{
    const {name, username, email, password} = req.body;
    const passwordHash = await encrypt(password);

    try{
        const userEmail = await User.findOne({email: email});
        const userUsername = await User.findOne({username: username});

        if(userEmail){
            return res.json({error: 'emailAlreadyRegistered'})
        }else if(userUsername){
            return res.json({error: 'usernameAlreadyRegistered'})
        }else{
            const userDB = new User({
                name: name,
                username: username,
                email: email,
                password: passwordHash,
                role: 'user',
                verified: false,
            });
            
            await userDB.save()
            .then(
                await Subscription({
                    userId: userDB._id,
                    subsribed: [],
                    subscribers: [],
                }).save()
                .then(
                    res.json({
                        userId: userDB._id, 
                        success: 'successfulSignup'
                    }
                )
            ));
        }
    }catch(err){
        return res.json(err);
    }
})

router.post('/verify-user', async(req,res)=>{
    const {userId} = req.body;

    try{
        await User.updateOne(
            {_id: userId},
            {verified: true},
            {upsert: true},
        )
    }catch(err){
        console.log(err);
    }
})

router.post('/login', async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user = await User.findOne({email: email});

        if(user){
            const compareHash = await compare(password, user.password);
            if(compareHash === false){
                return res.json({error: 'invalidPassword'});
                
            }else if(compareHash === true){

                const token = jwt.sign({userId: user._id}, process.env.JWT_KEY);
                
                return res.json({userId:user._id, token: token, success: 'successfulLogin'});
            }
        }else{
            return res.json({error: 'invalidEmail'})
        }

    }catch(err){
        return res.json(err);
    }
})

router.post('/get-user', verifyJWT, async(req,res)=>{
    const{userId} = req.body;

    try{
        const user = await User.findById(userId);

        if(user){
            res.json({
                name: user.name,
                username: user.username,
                email: user.email
            });
        }
    }catch(err){
        return res.json(err);
    }
})

router.post('/update-user', verifyJWT, async(req,res)=>{
    const{userId, name, username, email} = req.body;

    try{
        await User.updateOne(
            {_id: userId},
            {
                name: name,
                username: username,
                email: email
            },
            {
                upsert: true
            }
        )
        .then(
            res.json({success : 'successUserUpdate'})
        )
    }catch(err){
        res.json(err)
    }
})

router.post('/get-user-profile', async(req,res)=>{
    const{userId} = req.body;

    try{
        const user = await User.findById(userId);
        const videos = await Video.find({userId: userId});

        if(user){
            res.json({
                userId: user._id,
                username: user.username,
                userProfilePicture: user.profilePicture || '',
                videos: videos,
            })
        }
    }catch(err){
        return res.json(err)
    }
})

router.post('/get-profile-picture', async(req,res)=>{
    const{userId} = req.body;

    try{
        const user = await User.findOne({_id: userId});

        if(user){
            res.json({url: user.profilePicture});
        }
    }catch(err){
        res.json(err);
    }
})

router.post('/update-profile-picture', verifyJWT, async(req,res)=>{
    const{url, userId} = req.body;

    try{
        await User.updateOne(
            {_id: userId},
            {profilePicture:url},
            {upsert: true},
        )
        .then(
            res.json({success:'successUserProfilePictureUpdate'})
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


