'use client';

import React, { useState } from 'react'
import {getCookie} from 'cookies-next';
import {storage} from '../../storage/firebase';
import {ref, uploadBytes, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import {errorAlert, successAlert} from '../../ui/alerts';
import {useRouter} from 'next/navigation';
import {useScopedI18n} from '../../../locales/client';

const UploadVideo = () => {

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const jwt = getCookie('jwt');
    const userId = getCookie('user-id');
    const router = useRouter();
    const[progressBar, setProgressBar] = useState<number>(0);
    const[progressBarDisplay, setProgressBarDisplay] = useState<string>('hidden');
    const scopedT = useScopedI18n('uploadVideo')
    const scopedtErrorAlerts = useScopedI18n('errorAlerts');
    const scopedtSuccessAlerts = useScopedI18n('successAlerts');

    const upload = async() =>{
        const videoName = (document.getElementById('videoName') as HTMLInputElement).value;
        const videoDescription = (document.getElementById('videoDescription')as HTMLInputElement).value;
        const videoFile = (document.getElementById('videoFile') as HTMLInputElement).files?.[0];

        if(!videoName || !videoDescription || !videoFile){
            return errorAlert('Debe llenar todos los campos');
        }

        const video = {
            videoName: videoName,
            videoDescription: videoDescription,
            userId: userId,
        };

        const post = {
            method: 'POST',
            headers: {
                'authorization': jwt!,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(video),
        }

        await fetch(serverUrl+'/api/videos/upload-video',post)
        .then((response)=>response.json())
        .then(res=>{
            const storageRef = ref(storage, `/users/${userId}/videos/${res.videoId}`);
            const uploadVideo = uploadBytesResumable(storageRef, videoFile!)

            uploadVideo.on('state_changed',
                (video)=>{
                    setProgressBarDisplay('');
                    setProgressBar((video.bytesTransferred / video.totalBytes) * 100)
                },
                (err)=>{
                    errorAlert(err.message)
                },
                ()=>{
                    getDownloadURL(uploadVideo.snapshot.ref)
                    .then(async(videoUrl)=>{
                        await fetch(serverUrl+'/api/videos/upload-video-url',{
                            method: 'POST',
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                videoId: res.videoId,
                                videoUrl: videoUrl
                            })
                        })
                        .then((response)=>response.json())
                        .then(res=>{
                            if(res.error){
                                return errorAlert(res.error);
                            }else if(res.success){
                                successAlert(scopedtSuccessAlerts(res.success));
                                return setTimeout(() => {
                                    router.push('/');
                                }, 1500); 
                            }
                        })
                    })
                }
            )
        })
        .catch((err)=>{
            console.log(err);
            errorAlert('Server Connection Error')
        })
    }

    return (
        <div className='mt-20 text-center items-center '>
            <div className='card shadow-xl border-2 rounded-lg w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto'>
                <div className='card-body'>
                    <p className='font-bold text-lg mb-10'>{scopedT('videoText')}</p>
                    <input type='text' placeholder={scopedT('videoNamePlaceholder')} className='input input-bordered border-2' id='videoName' maxLength={100}/>
                    <textarea placeholder={scopedT('videoDescriptionPlaceholder')}  className='textarea textarea-bordered border-2 mt-10 resize-none' id='videoDescription' maxLength={1000}/>
                    <input type='file' placeholder='Nombre del video' className='file-input rounded-lg border-2 mt-10'  id='videoFile'/>
                    <button onClick={upload} className='mt-10 btn btn-accent w-1/2 mx-auto'>{scopedT('uploadButton')}</button>
                    <div className={'grid mx-auto mt-10 w-full '+progressBarDisplay}>
                        <progress className='progress progress-secondary' value={progressBar?.toString()} max='100'/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default UploadVideo