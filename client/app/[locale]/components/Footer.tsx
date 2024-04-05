import React from 'react'
import {getScopedI18n} from '../../../locales/server';

const Footer = async() => {

  const scopedT = await getScopedI18n('footer');

  return (
    <footer className="pt-2 pb-2 bg-neutral text-neutral-content">
        <p className='text-center text-sm'>{scopedT('footer')}</p>
    </footer>
  )
}

export default Footer