'use client';

import React,{useEffect, useState} from 'react'
import {useParams, useRouter} from 'next/navigation';
import Link from 'next/link';
import Subscribe from '../../components/Subscribe';
import {getCookie} from 'cookies-next';

interface Video{
    _id:string, 
    videoName:string, 
    videoDescription:string, 
    videoUrl:string, 
    userId:string,
}

interface UserProfile{
    username: string,
    userProfilePicture: string,
    videos: Video[],
}

const UserPage = () => {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const params = useParams();
    const[userProfile,setUserProfile] = useState<UserProfile>();
    const userId = getCookie('user-id');
    const router = useRouter();

    const getUserProfile = async() =>{
        await fetch(serverUrl+'/api/users/get-user-profile',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({userId: params.userId})
        })
        .then(response=>response.json())
        .then(res=>{
            if(res.userId === userId){
                router.push('/my-videos');
                router.refresh();
            }else{
                setUserProfile(res);
            }
            
            
        })
    }

    useEffect(()=>{
        getUserProfile();
    },[])

    return (
        <div>
            {
                userProfile
                ?
                <div className='w-full mx-auto'>
                    <div className='mt-10'>
                        <img className='w-28 rounded-full mx-auto' src={userProfile.userProfilePicture}/>
                        <p className='text-2xl font-bold text-center mt-5'>{userProfile.username}</p>
                        <div className='mx-auto w-28 mt-10'>
                            <Subscribe videoUserId={params.userId}/>
                        </div>
                    </div>
                    <div className='w-full text-center ps-20 pe-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-20'>
                        {
                            userProfile.videos && userProfile.videos.length>0
                            ?
                                userProfile.videos.map((video,i)=>{
                                    return <div key={i} className='card w-96 mb-10  mx-auto'>
                                        <Link href={'/watch/'+video._id} className='card-body p-0'>
                                            <video disableRemotePlayback src={video.videoUrl} className='rounded-sm'/>
                                            <p className='card-title ps-2 my-2 overflow-hidden'>{video.videoName}</p>
                                        </Link>
                                    </div>
                                })
                            :
                            null
                        }
                    </div>
                </div>
                :
                null
            }
            <div></div>
        </div>
    )
}

export default UserPage