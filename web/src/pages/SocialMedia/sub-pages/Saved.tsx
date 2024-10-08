import { useContext } from 'react'

import { GridPostList, Loader } from 'src/components/shared'
import { AppContext } from 'src/contexts/app.context'
import { useGetUserSavedPosts } from 'src/lib/socialQueries/queries'

import { Post } from 'src/types/social.type'

const Saved = () => {
  const { profile: currentUser } = useContext(AppContext)

  const { savedPosts, isLoading } = useGetUserSavedPosts()

  return (
    <div className='saved-container'>
      <div className='flex gap-2 w-full max-w-5xl'>
        <img src='/assets/icons/save.svg' width={36} height={36} alt='edit' className='invert-white' />
        <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
      </div>

      {!currentUser && isLoading ? (
        <Loader />
      ) : (
        <ul className='w-full flex justify-center max-w-5xl gap-9'>
          {savedPosts.length === 0 ? (
            <p className='text-light-4'>No available posts</p>
          ) : (
            <GridPostList posts={savedPosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved
