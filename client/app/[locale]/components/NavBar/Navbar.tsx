import Link from 'next/link'
import React, { use } from 'react'
import SearchBar from './SearchBar';
import NavBarActions from './NavBarActions';
import ChangeLanguage from './ChangeLanguage';
import {getScopedI18n} from '../../../../locales/server';

const Navbar = async() => {

  const scopedT = await getScopedI18n('navbar')

  return (
    <div className='navbar pb-5 bg-lime-200 pt-5'>
        <div className='pl-5 font-bold flex-1'>
            <Link href='/' className='text-xl'>Wetube</Link>
        </div>
          <SearchBar search={scopedT('search')}/>
          <NavBarActions 
          login={scopedT('login')}
          signup={scopedT('signup')}
          uploadVideo={scopedT('uploadVideo')}
          logout={scopedT('logout')}
          myVideos={scopedT('myVideos')}
          editProfile={scopedT('editProfile')}
          mySubscriptions = {scopedT('mySubscriptions')}
          />
          <ChangeLanguage/>
    </div>
  )
}

export default Navbar