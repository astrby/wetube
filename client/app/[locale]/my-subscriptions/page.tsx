'use client'

import React, { useEffect, useState } from 'react'
import {getCookie} from 'cookies-next';
import Videos from '../components/Videos';
import Link from 'next/link';
import {useScopedI18n} from '../../../locales/client';
import {errorAlert} from '../../ui/alerts';

interface Video{
  _id: string,
  videoName: string,
  videoUrl: string,
  username: string,
  userId: string,
  profilePicture: string,
}

interface User{
  _id: string,
  username: string,
  profilePicture: string,
}

const page = () => {

  const userId = getCookie('user-id');
  const jwt = getCookie('jwt');
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const[videos, setVideos] = useState<Video[]>([]);
  const[users, setUsers] = useState<User[]>([]);
  const scopedTSubscriptions = useScopedI18n('subscriptions');

  const getSubscriptions = async() =>{
    await fetch(serverUrl+'/api/subscriptions/my-subscriptions', {
      method: 'POST',
      headers: {
        'authorization':jwt!,
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      })
    })
    .then(response=>response.json())
    .then(res=>{
        setVideos(res.videos);
        setUsers(res.users)
      }
    )
    .catch(err=>{
      console.log(err)
      errorAlert('Server Connection Error')
  })
  }

  useEffect(()=>{
    getSubscriptions();
  },[userId])

  return (
    <div className='drawer'>
      <input id='my-drawer' type='checkbox' className='drawer-toggle'/>
        <div className='grid grid-cols-[20%_80%] md:grid-cols-[10%_90%]'>
          <div className='flex h-[calc(100vh-8rem)] justify-center items-center me-auto'>
            <label htmlFor='my-drawer' className='btn btn-accent drawer-button text-left w-10 h-28 rounded-none rounded-tr-md rounded-br-md text-md'>
              <p className='rotate-90'>{scopedTSubscriptions('subscriptions')}</p>
            </label>
          </div>
            <Videos videos={videos}/>
        </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer' aria-label='close sidebar' className='drawer-overlay'></label>
        <ul className='menu p-4 w-60 min-h-[calc(100vh-9rem)] text-base-content bg-base-200 mt-24 rounded-tr-md rounded-br-md'>
        <p className='ps-2 text-center text-lg font-bold mb-5 mt-2'>{scopedTSubscriptions('subscriptions')}</p>
          {
            users && users.length>0
            ?
            users.map((user,i)=>{
              return <div key={i} className=''>
                <Link href={'/user/'+user._id} className='grid grid-cols-[25%_70%] mb-2 hover:bg-neutral-content rounded-md p-2'>
                  {
                    user.profilePicture.trim() === ''
                    ?
                    <p className='text-lg rounded-full border h-3/5'>{user.username.substring(0,1)}</p>
                    :
                    <img src={user.profilePicture} className='w-10 h-10 rounded-full'/>
                  }
                  <p className='h-2/5 text-lg me-auto ms-2'>{user.username.substring(0,10)}</p>
                </Link>
              </div>
            })
            :
            null
          }
        </ul>
      </div>
    </div>
  )
}

export default page