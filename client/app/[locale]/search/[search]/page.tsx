'use client'

import React,{useEffect, useState} from 'react'
import {useParams} from 'next/navigation';
import {useScopedI18n} from '../../../../locales/client';
import Videos from '../../components/Videos';
import { errorAlert } from '@/app/ui/alerts';

interface Video{
    _id: string,
    videoName: string,
    videoDescription: string,
    videoUrl: string,
}

const Page = () => {

    const params = useParams();
    const search = params.search;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const[videos, setVideos] = useState<Video[]>([]);
    const scopedT = useScopedI18n('searchResults');

    const getSearch = async() => {

        const post = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({searchQuery: decodeURIComponent(search.toString())}),
        }

        await fetch(serverUrl+'/api/videos/get-search-videos',post)
        .then(response=>response.json())
        .then((res)=>{
            setVideos(res)
        })
        .catch(err=>{
            console.log(err)
            errorAlert('Server Connection Error')
        })
    }

    useEffect(()=>{
        getSearch();
    },[])

    return (
        <div>
            <p className='text-2xl w-full text-center font-bold mt-10 break-all px-5'>{scopedT('resultsTitle')} {decodeURIComponent(search.toString())}</p>
            <Videos videos={videos}/>
        </div>
    )
}

export default Page