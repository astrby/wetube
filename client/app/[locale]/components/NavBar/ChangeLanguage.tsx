'use client'

import React from 'react'
import {useChangeLocale} from '../../../../locales/client';

const ChangeLanguage = () => {

  const changeLocale = useChangeLocale();

  return (
    <div className='gap-1'>
          <button value='es' className='text-sm' onClick={()=>{
            changeLocale('es')
          }}>ES</button>
          <button value='en' className='text-sm' onClick={()=>{
            changeLocale('en')
          }}>EN</button>
        </div>
  )
}

export default ChangeLanguage