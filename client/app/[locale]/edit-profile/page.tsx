'use client'

import React, { useEffect, useState } from 'react'
import {getCookie} from 'cookies-next';
import {successAlert, errorAlert} from '../../ui/alerts';
import {storage} from '../../storage/firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import ProfilePicture from '../components/ProfilePicture';
import {useScopedI18n} from '../../../locales/client';

interface User{
    name: string,
    username: string,
    email: string,
}

const EditProfile = () => {

    const userId = getCookie('user-id');
    const jwt = getCookie('jwt');
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const[user, setUser] = useState<User>();
    const[profilePicture, setProfilePicture] = useState<String>();
    const scopedT = useScopedI18n('profile');
    const scopedTSuccessAlerts = useScopedI18n('successAlerts');

    const updateUser = async()=>{
        var name = (document.getElementById('name') as HTMLInputElement).value;
        var username = (document.getElementById('username') as HTMLInputElement).value;
        var email = (document.getElementById('email') as HTMLInputElement).value;

        if(!name){
            name = user!.name;
        }
        if(!username){
            username = user!.username;
        }
        if(!email){
            email = user!.email;
        }

        const userPost={
            userId: userId,
            name: name,
            username: username,
            email: email,
        }

        await fetch(serverUrl+'/api/users/update-user',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': jwt!,
            },
            body: JSON.stringify(userPost),
        })
        .then(response=>response.json())
        .then((res)=>{

            successAlert(scopedTSuccessAlerts(res.success));
        
            return setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        })
    }

    const updateProfilePicture = () =>{
        const profilePicture = (document.getElementById('profilePicture') as HTMLInputElement).files?.[0];

        const storageRef = ref(storage, `/users/${userId}/profilePicture/profilePicture.jpg`);

        uploadBytes(storageRef, profilePicture!)
        .then((image)=>{

            getDownloadURL(image.ref)
            .then(async(url: string)=>{
                
                await fetch(serverUrl+'/api/users/update-profile-picture',{
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json',
                        'authorization': jwt!
                    },
                    body: JSON.stringify({
                        userId: userId,
                        url: url,
                    }),
                })
                .then(response=>response.json())
                .then((res)=>{
                    if(res.success){
                        successAlert(scopedTSuccessAlerts(res.success));
                        setTimeout(() => {
                            return window.location.reload();
                        }, 2000);
                    }
                })
            })
        })
    }

    const getUser = async() =>{
        const post = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': jwt!,
            },
            body: JSON.stringify({userId: userId}),
        }

        await fetch(serverUrl+'/api/users/get-user',post)
        .then(response=>response.json())
        .then((res: User)=>{
            setUser(res);
        })
        .catch((err)=>{
            console.log(err);
            errorAlert('Server Connection Error')
        })

        await fetch(serverUrl+'/api/users/get-profile-picture',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization':jwt!,
            },
            body: JSON.stringify({
                userId: userId,
            })
        })
        .then(response=> response.json())
        .then(res=>{
            setProfilePicture(res.url)
        })
    }

    useEffect(()=>{
        getUser();
    },[]);

    return (
        <div>
            <p className='text-center mt-8 text-4xl mb-5'>{scopedT('profile')}</p>
            {
                user
                ?
                    <div className='grid grid-cols-2 w-full text-center text-lg'>
                        <div className='ms-auto flex flex-col items-center justify-center ps-10 pt-5'>
                            <div className='w-40 md:w-52 h-52 me-auto'>
                                <ProfilePicture/>
                            </div>
                            <input onInput={updateProfilePicture} type='file' id='profilePicture' className='file-input'/>
                        </div>
                        <div className='me-auto pt-10'>
                            <p>{scopedT('name')}</p>
                            <input className='input input-bordered mt-2 mb-5 md:w-80' placeholder={user.name} id='name'/>
                            <p>{scopedT('username')}</p>
                            <input className='input input-bordered mt-2 mb-5 md:w-80' placeholder={user.username} id='username'/>
                            <p>{scopedT('email')}</p>
                            <input className='input input-bordered mt-2 mb-5 md:w-80' placeholder={user.email} id='email'/>
                            <br/>
                            <button onClick={updateUser} className='btn btn-accent text-lg mt-2'>{scopedT('updateUserButton')}</button>
                        </div>
                    </div>
                :
                    null
            }
        </div>
    )
}

export default EditProfile