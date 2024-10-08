import { useContext } from 'react'
import { GridPostList, Loader } from 'src/components/shared'
import { AppContext } from 'src/contexts/app.context'
import { useGetLikedPosts } from 'src/lib/socialQueries/queries'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'

const LikedPosts = () => {
  const { profile: currentUser } = useContext(AppContext)
  const { user } = useUserByEmail(currentUser?.email)

  const { posts: likedPosts, isLoading } = useGetLikedPosts(user?._id)

  if (!currentUser || !likedPosts || isLoading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <>
      {likedPosts.length === 0 && <p className='text-light-4'>No liked posts</p>}

      <GridPostList posts={likedPosts} showStats={false} />
    </>
  )
}

export default LikedPosts
