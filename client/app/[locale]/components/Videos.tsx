import React from 'react'
import Link from 'next/link';

interface Video{
    _id: string,
    videoName: string,
    videoUrl: string,
    username: string,
    userId: string,
}

const Videos = ({videos}:any) => {
  return (
    <div className='pt-20'>
        {
            videos.length>0 
            ?
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
                {
                    videos.map((video:Video, i:number)=>{
                        {i=i+1}
                        return <div className='card w-80 mb-10 mx-auto' key={i}>
                            <div className='card-body p-0'>
                                <Link href={'/watch/'+video._id}>
                                    <video disableRemotePlayback className='rounded' src={video.videoUrl}></video>
                                </Link>
                                <Link href={'/user/'+video.userId} className='card-title ps-2 pt-2 overflow-hidden text-sm font-bold hover:text-slate-400'>{video.username}</Link>
                                <Link href={'/watch/'+video._id} className='card-title ps-2 pb-2 overflow-hidden '><p className='font-bold size-8'>{video.videoName}</p></Link>
                            </div>
                        </div>
                    })
                }
            </div>
            :
            null
        }
    </div>
  )
}

export default Videos