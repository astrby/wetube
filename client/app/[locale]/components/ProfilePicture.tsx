import React, { useEffect, useState } from 'react'
import {getCookie} from 'cookies-next';
import {useScopedI18n} from '../../../locales/client';

const ProfilePicture = () => {

    const [profilePicture, setprofilePicture] = useState<string>();
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const userId = getCookie('user-id');
    const scopedT = useScopedI18n('navbar');

    const getProfilePicture = async() =>{
        await fetch(serverUrl+'/api/users/get-profile-picture',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({userId: userId}),
        })
        .then((response)=>response.json())
        .then(res=>{
            setprofilePicture(res.url)
        })
    }

    useEffect(()=>{
        getProfilePicture();
    },[userId])

  return (
    <div>
        {
            profilePicture
            ?
                <img className='rounded-full' src={profilePicture}/>
            :
                <p className='text-lg'>{scopedT('me')}</p>
        }
    </div>
  )
}

export default ProfilePicture