'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import {BsThreeDotsVertical} from 'react-icons/bs';
import {getCookie} from 'cookies-next';
import {errorAlert, successAlert} from '../../ui/alerts';
import {useScopedI18n} from '../../../locales/client';

interface Comment{
  comment: string,
  username: string,
  userId: string,
  commentId: string,
  profilePicture: string,
}

const Comments = (videoId: any) => {

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const[comments, setComments] = useState<Comment[]>([]);
  const userId = getCookie('user-id');
  const jwt = getCookie('jwt');
  const scopedT = useScopedI18n('watch');
  const scopedTErrorAlerts = useScopedI18n('errorAlerts');
  const scopedTSuccessAlerts = useScopedI18n('successAlerts');

  const getComments = async()=>{
    await fetch(serverUrl+'/api/comments/get-comments',{
      method: 'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({videoId: videoId.videoId})
    })
    .then(response=>response.json())
    .then((res)=>{
      setComments(res);
    })
  }

  const deleteComment = async(commentId: string) =>{

    await fetch(serverUrl+'/api/comments/delete-comment', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'authorization':jwt!,
      },
      body: JSON.stringify({commentId: commentId}),
    })
    .then(response=>response.json())
    .then((res)=>{
      if(res.error){
        errorAlert(res.error);
      }else if(res.success){
        successAlert(scopedTSuccessAlerts(res.success));
        return getComments();
      }
    })
  }

  const postComment = async() =>{

    const jwt = getCookie('jwt');
    const comment = (document.getElementById('comment') as HTMLInputElement).value;
    const userId = getCookie('user-id');
    
    if(!jwt){
        return errorAlert(scopedTErrorAlerts('loginError'))
    }else if(!comment.trim() ){
        return errorAlert(scopedTErrorAlerts('fillError'))
    }else{
        const commentPost = {
            comment: comment,
            userId: userId,
            videoId: videoId.videoId,
        }

        const post = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': jwt!
            },
            body: JSON.stringify(commentPost),
        }

        await fetch(serverUrl+'/api/comments/post-comment', post)
        .then(response=>response.json())
        .then((res)=>{
            if(res.error){
                return errorAlert(res.error)
            }else if(res.success){
               successAlert(scopedTSuccessAlerts(res.success));
               (document.getElementById('comment') as HTMLInputElement).value = '';
               return getComments();
            }else{
                return errorAlert(res);
            }
        })
    }
  }

  useEffect(()=>{
    getComments();
  },[])

  return (
    <div className='pb-40'>
      <div className='w-full'>
          <textarea className='textarea textarea-bordered w-full resize-none text-md' placeholder={scopedT('commentText')} maxLength={1000} id='comment'/>
          <button onClick={postComment} className='btn btn-accent mt-2 text-sm'>{scopedT('commentButton')}</button>
      </div>
      <hr className='mt-5 mb-10'/>
      {
        comments.length>0
        ?
          comments.map((comment,i)=>{
            return <div key={i} className='mt-5 grid grid-cols-[10%_85%] text-lg'>
                  <div  className='flex flex-col items-center justify-center me-5 mb-2'>
                    <img className='w-10 h-10 rounded-full' src={comment.profilePicture}/>
                  </div>
                  <div>
                    <Link href={'/user/'+comment.userId} className='me-2 font-bold text-md'>{comment.username}</Link>
                    <div className='grid grid-cols-[90%_2%] mt-2 h-10'>
                      <p className='inline-block break-all text-sm'>{comment.comment}</p>
                        {
                          userId === comment.userId
                          ?
                          <details className='dropdown dropdown-end'>
                            <summary className='btn border-hidden shadow-none bg-base-100'>
                              <BsThreeDotsVertical/>
                            </summary>
                            <div className='dropdown-content shadow menu rounded'>
                              <ul>
                                <li onClick={()=>{deleteComment(comment.commentId)}} className='hover:cursor-pointer text-md'>{scopedT('deleteComment')}</li>
                              </ul>
                            </div>
                          </details>
                          :
                            ''
                        }
                    </div>
                </div>
            </div>
          })
        :
          null
      }
    </div>
  )
}

export default Comments