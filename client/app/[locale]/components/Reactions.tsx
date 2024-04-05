'use client'

import React,{useState, useEffect, cache} from 'react'
import {AiOutlineLike, AiFillLike} from 'react-icons/ai';
import {getCookie} from 'cookies-next';
import {errorAlert, successAlert} from '../../ui/alerts';
import {useScopedI18n} from '../../../locales/client';

const LikeVideo = (videoId: any) => {

    const[reaction, setReaction] = useState<boolean>(false);
    const[reactionsNumber, setReactionsNumber] = useState<number>();
    const jwt = getCookie('jwt');
    const userId = getCookie('user-id');
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const scopedTErrorAlerts = useScopedI18n('errorAlerts');

    const getReaction = async() =>{
        
        const body = {
            userId: userId,
            videoId: videoId.videoId,
        }

        const post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }

        await fetch(serverUrl+'/api/reactions/get-user-reaction',post)
        .then(response=>response.json())
        .then((res)=>{
            return setReaction(res.reaction)
        })
    }

    const getReactionsNumber = async()=>{
        const post = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({videoId: videoId.videoId}),
        }

        await fetch(serverUrl+'/api/reactions/get-reactions-number',post)
        .then(response=>response.json())
        .then((res)=>{
            setReactionsNumber(res.reactionsNumber)
        })
    }

    const postReaction = async() =>{

        if(!userId){
            errorAlert(scopedTErrorAlerts('loginError'));
        }else{
            const body ={
                videoId: videoId.videoId,
                userId: userId,
                reaction: !reaction
            }
    
            const post ={
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'authorization':jwt!
                },
                body: JSON.stringify(body),
            }
    
            await fetch(serverUrl+'/api/reactions/user-reaction', post)
            .then(response=>response.json())
            .then((res)=>{
                if(res==='success'){
                    setTimeout(() => {
                        getReactionsNumber();
                        getReaction();
                    }, 500);
                }
            })
        }
    }

    useEffect(()=>{
        getReaction();
        getReactionsNumber();
    },[])

    return (
        <div className=' pe-2 mt-5 '>
            <button onClick={postReaction} className='btn btn-accent ps-8 pe-8 w-full grid grid-cols-[20%_20%]'>
                {
                    reaction === false
                    ?
                        <AiOutlineLike className='size-4'/>
                    :
                        <AiFillLike className='size-4'/>
                }
                <p className='ms-2 hidden md:grid text-sm'>{reactionsNumber}</p>
            </button>
        </div>
    )
}

export default LikeVideo