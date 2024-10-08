import { Route, Routes, Link, Outlet, useParams, useLocation } from 'react-router-dom'

import { Button } from 'src/components/ui'
import { GridPostList, Loader } from 'src/components/shared'
import LikedPosts from './LikedPosts'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'
import { useUserById } from 'src/pages/Chat/hooks/users/useUserById'
import { useGetUserPosts } from 'src/lib/socialQueries/queries'

interface StabBlockProps {
  value: string | number
  label: string
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className='flex-center gap-2'>
    <p className='small-semibold lg:body-bold text-primary-500'>{value}</p>
    <p className='small-medium lg:base-medium text-light-2'>{label}</p>
  </div>
)

const Profile = () => {
  const { userId } = useParams()
  const { profile } = useContext(AppContext)
  const { isLoading, user: currentUser } = useUserByEmail(profile?.email)
  const { isLoading: isPostLoading, posts } = useGetUserPosts(userId!)
  const { pathname } = useLocation()

  const { isLoading: isLoadingUser, user } = useUserById(userId!)

  if (!user || !posts || isPostLoading || isLoading || isLoadingUser)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
          <img
            src={user?.avatarUrl || '/assets/icons/profile-placeholder.svg'}
            alt='profile'
            className='w-28 h-28 lg:h-36 lg:w-36 rounded-full'
          />
          <div className='flex flex-col flex-1 justify-between md:mt-2'>
            <div className='flex flex-col w-full'>
              <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>{user?.userName}</h1>
              <p className='small-regular md:body-medium text-light-3 text-center xl:text-left'>@{user?.userName}</p>
            </div>

            <div className='flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20'>
              <StatBlock value={posts.length} label='Posts' />
              <StatBlock value={20} label='Followers' />
              <StatBlock value={20} label='Following' />
            </div>

            <p className='small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm'>{user.bio}</p>
          </div>

          <div className='flex justify-center gap-4'>
            <div className={`${currentUser._id !== user.id && 'hidden'}`}>
              <Link
                to={`/update-profile/${user.id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  currentUser._id !== user.id && 'hidden'
                }`}
              >
                <img src={'/assets/icons/edit.svg'} alt='edit' width={20} height={20} />
                <p className='flex whitespace-nowrap small-medium'>Edit Profile</p>
              </Link>
            </div>
            <div className={`${currentUser._id === userId && 'hidden'}`}>
              <Button type='button' className='shad-button_primary px-8'>
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {user.id === currentUser._id && (
        <div className='flex max-w-5xl w-full'>
          <Link
            to={`/social/profile/${userId}`}
            className={`profile-tab rounded-l-lg ${pathname === `/social/profile/${userId}` && '!bg-dark-3'}`}
          >
            <img src={'/assets/icons/posts.svg'} alt='posts' width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/social/profile/${userId}/social/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/social/profile/${userId}/liked-posts` && '!bg-dark-3'}`}
          >
            <img src={'/assets/icons/like.svg'} alt='like' width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={posts} showUser={false} />} />
        {user.id === currentUser._id && <Route path='/social/liked-posts' element={<LikedPosts />} />}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile