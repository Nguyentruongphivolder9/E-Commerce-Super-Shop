import { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { checkIsLiked } from 'src/lib/utils'
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetUserSavedPosts,
  useGetUserSavedIdPosts
} from 'src/lib/socialQueries/queries'
import { AppContext } from 'src/contexts/app.context'
import { AccountPostLikeResponse, Post } from 'src/types/social.type'
import { User } from 'src/types/user.type'

type PostStatsProps = {
  post: Post
  user: User
}

const PostStats = ({ post, user }: PostStatsProps) => {
  const location = useLocation()
  const likesList = post.likes

  const [likes, setLikes] = useState<AccountPostLikeResponse[]>(likesList)

  const [isSaved, setIsSaved] = useState(false)
  const { isLoading, savedPosts } = useGetUserSavedIdPosts()

  //done
  const { mutate: likePost, isPending: isLiking } = useLikePost()
  const { mutate: savePost, isPending: isSaving } = useSavePost()
  const { mutate: deleteSavePost, isPending: isDeleting } = useDeleteSavedPost()

  const { profile: currentUser } = useContext(AppContext)

  useEffect(() => {
    if (!isLoading && savedPosts) {
      const isPostSaved = savedPosts.some((savedPost) => savedPost.postId === post.id)
      setIsSaved(isPostSaved)
    }
  }, [isLoading, savedPosts, post.id])

  const handleLikePost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    let likesArray = [...likes]

    const userLikeIndex = likesArray.findIndex((like) => like.accountId === user._id)

    if (userLikeIndex !== -1) {
      // User has already liked the post, remove the like
      likesArray = likesArray.filter((like) => like.accountId !== user._id)
    } else {
      // User has not liked the post, add the like
      const newLike: AccountPostLikeResponse = {
        id: 'newId', // Generate a new ID for the like
        postId: post.id,
        accountId: user._id,
        accountName: currentUser?.userName || 'Unknown',
        accountAvatarUrl: currentUser?.avatarUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      likesArray.push(newLike)
    }

    setLikes(likesArray)
    likePost({ postId: post.id })
  }

  const handleSavePost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    if (isSaved) {
      deleteSavePost({ postId: post.id })
    } else {
      savePost({ postId: post.id })
    }

    setIsSaved(!isSaved)
  }

  const containerStyles = location.pathname.startsWith('/profile') ? 'w-full' : ''

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className='flex gap-2 mr-5'>
        <button onClick={(e) => handleLikePost(e)} className='cursor-pointer' disabled={isLiking}>
          <img
            src={`${checkIsLiked(likes, user._id) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}`}
            alt='like-image'
            width={20}
            height={20}
          />
        </button>
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>

      <div className='flex gap-2'>
        <button className='cursor-pointer' onClick={handleSavePost} disabled={isSaving || isDeleting}>
          <img
            src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
            alt='share'
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  )
}

export default PostStats
