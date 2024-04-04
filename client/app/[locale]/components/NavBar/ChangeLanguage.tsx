'use client'

import React from 'react'
import {useChangeLocale} from '../../../../locales/client';

const ChangeLanguage = () => {

  const changeLocale = useChangeLocale();

  return (
    <div className='gap-1 text-lg'>
          <button value='es' className='text-md' onClick={()=>{
            changeLocale('es')
          }}>ES</button>
          <button value='en' className='text-md' onClick={()=>{
            changeLocale('en')
          }}>EN</button>
        </div>
  )
}

export default ChangeLanguage