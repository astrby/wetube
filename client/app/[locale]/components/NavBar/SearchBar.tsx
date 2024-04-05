'use client'

import React from 'react'
import {CiSearch} from 'react-icons/ci';
import {useRouter} from 'next/navigation';

const SearchBar = ({search}: any) => {

  const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
  const router = useRouter();

  const getSearch = async() =>{
    const search = (document.getElementById('searchQuery') as HTMLInputElement).value;

    if(search.trim()!==''){
      router.push(clientUrl+'/search/'+search);
    }
  }

  return (
    <div className='grid grid-cols-[50%_30%] md:grid-cols-[50%_10%] w-3/4 md:1/4 justify-center md:justify-start gap-1 md:ps-5'>
      <input type='text' className='input input-bordered w-full text-md' id='searchQuery'/>
      <button onClick={getSearch} className='btn btn-accent w-16 md:w-full'>
        <p className='text-sm lg:text-md'>{search}</p>
      </button>
    </div>
  )
}

export default SearchBar