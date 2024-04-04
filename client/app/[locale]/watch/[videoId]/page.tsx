'use client'

import React, { useEffect, useState } from 'react'
import {useParams} from 'next/navigation';
import Comments from '../../components/Comments';
import Reactions from '../../components/Reactions';
import {useScopedI18n} from '../../../../locales/client';
import Subscribe from '../../components/Subscribe';
import {getCookie} from 'cookies-next';

interface Video{
    _id: string,
    videoName: string,
    videoDescription: string,
    videoUrl: string,
    userId: string,
}

const Video = () => {
  
    const params = useParams();
    const videoId = params.videoId;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const[video, setVideo] = useState<Video>();
    const[showMore, setShowMore] = useState<boolean>(false);
    const scopedT = useScopedI18n('watch');
    const userId = getCookie('user-id');
    
    const fetchVideo = async()=>{
        await fetch(serverUrl+'/api/videos/get-video',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({videoId: videoId})
        })
        .then((response)=>response.json())
        .then(res=>{
            return setVideo(res);
        })
    } 

    useEffect(()=>{
        fetchVideo();
    },[])

    return (
        <div className='pb-20'>
            {
                video
                ?
                <div className='p-2 md:p-10 lg:w-3/4 xl:w-3/5 xl:ms-20 text-lg'>
                    <div>
                        <video className='rounded mt-4' src={video.videoUrl} controls/>
                        <div className='grid grid-cols-[65%_35%]'>
                            <p className='text-2xl font-bold break-all pt-5'>{video.videoName}</p>
                            
                                {
                                    video.userId === userId
                                    ?
                                        null
                                    :
                                    <div className='grid grid-cols-[45%_45%] gap-2'>
                                        <Subscribe videoUserId={video.userId}/>
                                        <Reactions/>
                                    </div>
                                }
                                
                            
                        </div>
                    </div>
                    <div className='bg-neutral-200 rounded mt-10 min-h-20'>
                    <p className='font-bold mt-1 bg-neutral-300 rounded p-1 ps-2'>{scopedT('description')}</p>
                    {
                        showMore === false
                        ?
                            <p className='ps-2 pe-2 pt-2 break-all'>{video.videoDescription.substring(0,150)}</p>
                        :
                            <p className='ps-2 pe-2 pt-2 break-all'>{video.videoDescription}</p>
                    }
                    {
                        video.videoDescription.length>150
                        ?
                            <button onClick={()=>{setShowMore(!showMore)}} className='font-bold text-sm text-center w-full'>
                            {
                                showMore
                                ?
                                'Mostrar menos'
                                :
                                'Mostrar más'
                            }
                            </button>
                        : 
                            null
                    }
                    </div>
                    <div className='mt-5 ps-2'>
                        <p className='pt-5 text-xl font-bold mb-10'>{scopedT('comments')}</p>
                        <Comments videoId={videoId}/>
                    </div>
                </div>
                :
                null
            }
        </div>
    )
}

export default Video