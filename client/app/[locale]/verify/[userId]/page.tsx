'use client'

import React, { useEffect } from 'react'
import {useParams} from 'next/navigation';
import {useScopedI18n} from '../../../../locales/client';
import {errorAlert} from '../../../ui/alerts';

const page = () => {

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const params = useParams();
  const scopedTVerified = useScopedI18n('verifyEmail');

  const verifyAccount = async() => {
    await fetch(serverUrl+'/api/users/verify-user',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({
        userId: params.userId,
      })
    })
    .catch((err)=>{
      console.log(err)
      errorAlert('Server Connection Error')
    })
  }

  useEffect(()=>{
    verifyAccount();
  },[])

  return (
    <div className='mx-auto pt-10'>
      <p className='text-xl'>{scopedTVerified('verified')}</p>
    </div>
  )
}

export default page