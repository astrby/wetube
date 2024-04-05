'use client'

import React, {useEffect, useState} from 'react'
import {getCookie} from 'cookies-next';
import {useScopedI18n} from '../../../locales/client';

const Subscribe = (params:any) => {

    const jwt = getCookie('jwt');
    const userId = getCookie('user-id');
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const[subscribed, setSubcribed] = useState(false);
    const scopedT = useScopedI18n('subscribe');

    const checkSubscribed = async() =>{
        await fetch(serverUrl+'/api/subscriptions/check-subscribed',{
            method:'POST',
            headers:{
                'authorization': jwt!,
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                videoUserId: params.videoUserId,
            })
        })
        .then(response=> response.json())
        .then(res=>
            setSubcribed(res.subscribed)
        );
    }

    const handleSubscription = async(apiUrl:string) =>{

        await fetch(serverUrl+'/api/subscriptions/'+apiUrl,{
            method:'POST',
            headers:{
                'authorization': jwt!,
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                videoUserId: params.videoUserId,
            }),
        })
        .then(response=>response.json())
        .then(res=>{
            setTimeout(() => {
                setSubcribed(res.subscribed);
            }, 100);
        })
    }
    
    useEffect(()=>{
        checkSubscribed();
    },[])

    return (
        <div className='pt-5 w-full'>
            {
            
            subscribed === true
            ?
                <div onClick={()=>{handleSubscription('unsubscribe')}} className='btn btn-accent w-full text-sm'>{scopedT('unsubscribeButton')}</div>
            :
                <div onClick={()=>{handleSubscription('subscribe')}} className='btn btn-accent w-full text-wrap'>{scopedT('subscribeButton')}</div>
            }
        </div>
    )
}

export default Subscribe