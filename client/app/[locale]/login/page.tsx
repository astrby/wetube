'use client';

import React from 'react';
import {successAlert, errorAlert} from '../../ui/alerts';
import {setCookie} from 'cookies-next';
import {useRouter} from 'next/navigation';
import {useScopedI18n} from '../../../locales/client';

const LoginPage = () => {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const router = useRouter();
    const scopedT = useScopedI18n('login');
    const scopedTErrorAlerts = useScopedI18n('errorAlerts');
    const scopedTSuccessAlerts = useScopedI18n('successAlerts');

    const login = async() =>{
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password')as HTMLInputElement).value;
        
        if(!email || !password){
            return errorAlert(scopedTErrorAlerts('fillError'));
        }

        const user ={
            email: email,
            password: password,
        }

        const post = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }

        await fetch(serverUrl+'/api/users/login',post)
        .then((res)=>res.json())
        .then(res=>{
            if(res.error){
                errorAlert(scopedTErrorAlerts(res.error))
            }else if(res.success){
                setCookie('jwt', res.token);
                setCookie('user-id', res.userId)
                successAlert(scopedTSuccessAlerts('successfulLogin'));
                
                setTimeout(() => {
                    router.push('/');
                    router.refresh();
                }, 1500);
            }
        })
        .catch((err)=>{
            console.log(err);
            errorAlert('Server Connection Error')
        })
        
    }

    return (
    <div className='mt-20 items-center text-center'>
        <div className='card shadow-xl w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 mx-auto border-2'>
            <div className='card-body'>
                <p className='font-bold text-xl mb-5 mt-5'>{scopedT('credentials')}</p>
                <input type='text' placeholder={scopedT('email')} className='input input-bordered' id='email'/>
                <input type='password' placeholder={scopedT('password')} className='input input-bordered mt-5' id='password'/>
                <button onClick={login} className='btn btn-accent w-1/2 mx-auto mt-5'>{scopedT('loginButton')}</button>
            </div>
        </div>
    </div>
    )
}

export default LoginPage