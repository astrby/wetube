'use client';

import React from 'react'
import {successAlert, errorAlert} from '../../ui/alerts';
import {useScopedI18n} from '../../../locales/client';
import emailjs from '@emailjs/browser';

const SignupPage = () => {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
    const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const scopedT = useScopedI18n('signup');
    const scopetTErrorAlert = useScopedI18n('errorAlerts');
    const scopetTSuccessAlert = useScopedI18n('successAlerts');
    const scopedTVerifyAccount = useScopedI18n('verifyEmail');
    
    const signup = async() =>{
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password= (document.getElementById('password') as HTMLInputElement).value;

        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{5,10}$/;

        if(!name || !username || !email || !password){
            return errorAlert(scopetTErrorAlert('fillError'))
        }else if(passwordPattern.test(password) === false){
            return errorAlert(scopetTErrorAlert('signupPasswordError'));
        }

        const newUser = {
            name: name,
            username: username,
            email: email,
            password: password
        }

        const post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        }
        
        const req = await fetch(serverUrl+'/api/users/signup', post)
        .then((res)=>res.json())
        .then(res=>{
            if(res.error){
                errorAlert(scopetTErrorAlert(res.error));
            }else if(res.success){
                emailjs
                .send(emailjsServiceId!, emailjsTemplateId!,{
                    emailTitle: scopedTVerifyAccount('emailTitle'),
                    emailMessage: scopedTVerifyAccount('emailMessage'),
                    verify: scopedTVerifyAccount('verify'),
                    email: email,
                    username: username,
                    link: clientUrl+'/verify/'+res.userId,
                }!, {publicKey: emailjsPublicKey!});
    
                successAlert(scopetTSuccessAlert(res.success));
            }
        })
        .catch((err)=>{
            console.log(err)
            errorAlert('Server Connection Error')
        })
    }

    return (
    <div className='mt-20 items-center text-center'>
        <div className='card shadow-xl w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 mx-auto border-2'>
            <div className='card-body'>
                <p className='font-bold text-xl mb-5 mt-5'>{scopedT('signupHeader')}</p>
                <input type='text' placeholder={scopedT('name')} className='input input-bordered' id='name' maxLength={100}/>
                <input type='text' placeholder={scopedT('username')} className='input input-bordered mt-5' id='username'/>
                <input type='email' placeholder={scopedT('email')} className='input input-bordered mt-5' id='email'/>
                <input type='password' placeholder={scopedT('password')} className='input input-bordered mt-5' id='password'/>
                <p className='text-xs'>{scopedT('passwordText')}</p>
                <button onClick={signup} className='btn btn-accent w-1/2 mx-auto mt-5'>{scopedT('signupButton')}</button>
            </div>
        </div>
    </div>
    )
}

export default SignupPage