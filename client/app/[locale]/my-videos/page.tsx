'use client'

import React,{useEffect, useState} from 'react'
import {getCookie} from 'cookies-next';
import Link from 'next/link';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {errorAlert,successAlert} from '../../ui/alerts';
import {useScopedI18n} from '../../../locales/client';

interface Video{
    _id: string,
    videoName: string,
    videoDescription: string,
    videoUrl: string,
}

const MyVideos = () => {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const jwt = getCookie('jwt');
    const userId = getCookie('user-id');
    const[videos, setVideos] = useState<Video[]>([]);
    const[selectedVideo, setSelectedVideo] = useState<Video>()
    const scopedT = useScopedI18n('myVideos');
    const scopedTSuccess = useScopedI18n('successAlerts')

    const getMyVideos = async() =>{
        await fetch(serverUrl+'/api/videos/get-my-videos',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': jwt!
            },
            body: JSON.stringify({
                userId: userId,
            }),
        })
        .then((response)=>response.json())
        .then(res=>{
            setVideos(res);
        })
        .catch((err)=>{
            console.log(err);
            errorAlert('Server Connection Error')
        })
    }

    const deleteVideo = async(e: string) =>{
        await fetch(serverUrl+'/api/videos/delete-video',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization': jwt!
            },
            body: JSON.stringify({
                videoId : e.toString(),
            }),
        })
        .then((response)=>response.json())
        .then(res=>{
            successAlert(scopedTSuccess(res.success), (document.getElementById('deleteModal') as HTMLDialogElement));
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
    }

    const editVideo = async()=>{
        const videoId = (document.getElementById('videoId') as HTMLInputElement).value;
        var videoName = (document.getElementById('videoName') as HTMLInputElement).value;
        var videoDescription = (document.getElementById('videoDescription') as HTMLInputElement).value;
        const defaultVideoName = (document.getElementById('defaultVideoName') as HTMLInputElement);
        const defaultVideoDescription = (document.getElementById('defaultVideoDescription') as HTMLInputElement);

        if(videoName.trim()==='' && videoDescription.trim()===''){
            videoName = defaultVideoName.value;
            videoDescription = defaultVideoDescription.value;
        }else if (videoName.trim()===''){
            videoName = defaultVideoName.value;
        }else if(videoDescription.trim()===''){
            videoDescription = defaultVideoDescription.value;
        }
        
        await fetch(serverUrl+'/api/videos/edit-video', {
            method: 'POST',
            headers: {
                'authorization': jwt!,
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                videoId: videoId,
                videoName: videoName,
                videoDescription: videoDescription,
            })
        })
        .then((response)=>response.json())
        .then(res=>{
            successAlert(scopedTSuccess(res.success),
            (document.getElementById('modal') as HTMLDialogElement))
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        })
    }

    useEffect(()=>{
        getMyVideos();
    },[])

  return (
    <div>
        <p className='text-center pt-10 text-xl font-bold'>{scopedT ('myVideos')}</p>
            {
                videos.length>0
                ?
                <div className='w-full text-center ps-10 pe-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-20'>
                    {
                        videos.map((video,i)=>{
                            return <div key={i} className='card w-86 mb-10 text-lg mx-auto'>
                                <Link href={'/watch/'+video._id} className='card-body p-0'>
                                    <video disableRemotePlayback src={video.videoUrl} className='rounded-sm'/>
                                </Link>
                                <div className='grid grid-cols-[92%_8%]'>
                                    <Link href={'/watch/'+video._id}>
                                        <p className='card-title ps-2 my-2 overflow-hidden'>{video.videoName}</p>
                                    </Link>
                                    <details className='dropdown dropdown-end'>
                                        <summary className='btn shadow-none border-hidden bg-base-100 p-0 hover:bg-base-100'>
                                            <BsThreeDotsVertical className=' size-4'/>
                                        </summary>
                                        <div className='dropdown-content shadow rounded'>
                                            <ul>
                                                <li onClick={()=>{(document.getElementById('modal')as HTMLDialogElement).showModal();
                                                    setSelectedVideo(video)
                                                }}
                                                className='hover:cursor-pointer hover:bg-base-200 px-2 text-md'>{scopedT ('editButton')}</li>
                                            </ul>
                                            <ul>
                                                <li onClick={()=>{(document.getElementById('deleteModal') as HTMLDialogElement).showModal()}}
                                                className='hover:cursor-pointer hover:bg-base-200 px-2 text-md'>{scopedT ('deleteButton')}</li>
                                            </ul>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        })
                        
                    }
                    <dialog id='deleteModal' className='modal'>
                        <div className='modal-box'>
                            <form method='dialog'>
                                <button className='btn btn-ghost absolute right-4 top-2'>X</button>
                            </form>
                            <div className='mt-5 pb-10'>
                                <p className='font-bold'>{scopedT ('deleteVideoText')}</p>
                                <div className='w-1/2 grid grid-cols-2 mx-auto mt-10'>
                                    <button className='btn btn-success w-3/4 mx-auto text-md' onClick={()=>{deleteVideo(selectedVideo!._id)}}>{scopedT ('deleteVideoYes')}</button>
                                    <button className='btn btn-warning w-3/4 mx-auto text-md' onClick={()=>{(document.getElementById('deleteModal') as HTMLDialogElement).close()}}>{scopedT ('deleteVideoNo')}</button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    <dialog id='modal' className='modal'>
                        <div className='modal-box'>
                            <form method='dialog'>
                                <button className='btn btn-ghost absolute right-4 top-2'>X</button>
                            </form>
                            <div className='card-body'>
                                <p className='mb-2 text-md font-bold'>{scopedT ('videoName')}</p>
                                <input type='text' placeholder={selectedVideo?.videoName} className='text-center input input-bordered w-3/4 mx-auto' id='videoName'/>
                                <p className='mt-5 text-md font-bold'>{scopedT ('videoDescription')}</p>
                                <textarea className='mt-2 text-center resize-none input input-bordered w-3/4 mx-auto h-32' placeholder={selectedVideo?.videoDescription} id='videoDescription'/>
                                <input defaultValue={selectedVideo?.videoDescription} id='defaultVideoDescription' className='hidden'/>
                                <button className='btn btn-accent w-1/2 mx-auto mt-5 text-md' onClick={editVideo}>{scopedT ('editButton')}</button>
                            </div>
                        </div>
                    </dialog>
                    <input defaultValue={selectedVideo?._id} className='hidden' id='videoId'/>
                    <input defaultValue={selectedVideo?.videoName} id='defaultVideoName' className='hidden'/>
                    <input defaultValue={selectedVideo?.videoDescription} id='defaultVideoDescription' className='hidden'/>
                </div>  
                :
                <p className='text-center pt-10'>No videos</p>
            }
    </div>
  )
}

export default MyVideos