import React from 'react'
import Videos from './components/Videos';

interface Video{
    _id: string,
    videoName: string,
    videoUrl: string,
    username: string,
    userId: string,
}

export default async function page() {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    var videos: Video[]=[];
    
    await fetch(serverUrl+'/api/videos/get-videos',{cache: 'no-store'})
    .then((res)=>res.json())
    .then(res=>{
        videos = res;
    })
    .catch((err)=>{
        console.log(err)
    })

    return (
        <div>
            <Videos videos={videos}/>
        </div>
    )
}
