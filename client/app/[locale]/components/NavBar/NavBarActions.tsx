'use client'

import React, { useEffect, useState } from 'react'
import {getCookie, deleteCookie} from 'cookies-next';
import Link from 'next/link';
import ProfilePicture from '../ProfilePicture';
import {IoMenuSharp} from 'react-icons/io5';

interface props{
    login: string,
    signup: string,
    uploadVideo: string,
    logout: string,
    myVideos: string,
    editProfile: string,
    mySubscriptions: string,
  }

const NavBarActions = ({login, signup, uploadVideo, logout, myVideos, editProfile, mySubscriptions}: props) => {

    const jwt = getCookie('jwt');
    const [token, setToken] = useState<string>();

    const logoutHandler=()=>{
        deleteCookie('jwt');
        deleteCookie('user-id');
        window.location.reload();
    }

    useEffect(()=>{
        setToken(jwt);
    },[jwt]);

  return (
    <div>
        {
            token
            ?
                <div className='text-md grid grid-cols-[60%_40%]'>
                    <details className='dropdown dropdown-end me-5'>
                        <summary className='btn border-hidden hover:bg-lime-200 bg-lime-200 shadow-none'>
                            <div className='w-10'>
                                <ProfilePicture/>
                            </div>
                        </summary>
                        <ul className='dropdown-content z-[1] shadow w-40 bg-base-100 rounded-md'>
                            <li className=' ps-2 hover:bg-lime-200 p-1 text-md'>
                                <Link href='/my-subscriptions' className='text-md text-center xl:pt-2'>{mySubscriptions}</Link>
                            </li>
                            <li className=' ps-2 hover:bg-lime-200 p-1 text-md'>
                                <Link href='/upload-video' className='pt-3'>{uploadVideo}</Link>
                            </li>
                            <li className='pb-2 ps-2 hover:bg-lime-200 p-1'>
                                <Link href='/my-videos'>{myVideos}</Link>
                            </li>
                            <li className='pb-2 ps-2 hover:bg-lime-200 p-1'>
                                <Link href='/edit-profile'>{editProfile}</Link>
                            </li>
                            <li className=' ps-2 hover:bg-lime-200 p-1 text-md'>
                                <Link onClick={logoutHandler} href='/'>{logout}</Link>
                            </li>
                        </ul>
                    </details>
                </div>
            :
                <div>
                    <div className='grid grid-cols-2 dropdown p-0'>
                        <div tabIndex={0} role='button' className='btn btn-ghost md:hidden hover:bg-lime-200'>
                            <IoMenuSharp className='size-10'/>
                        </div>
                        <ul className='menu menu-sm dropdown-content mt-10 bg-base-100 rounded w-36'>
                            <li>
                                <Link href='/login'>{login}</Link>
                            </li>
                            <li className=''>
                                <Link href='/signup'>{signup}</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='hidden md:grid md:grid-cols-2 gap-2 pe-4 md:w-52 lg:w-56 mx-auto'>
                        <Link href='/login' className='ms-auto pe-2 w-fit'>{login}</Link>
                        <Link href='/signup' className='w-fit'>{signup}</Link>
                    </div>
                </div>
        }
    </div>
  )
}

export default NavBarActions