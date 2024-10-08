import { Suspense } from 'react'
import path from 'src/constants/path'

import SocialLayout from 'src/layouts/SocialLayout'
import AllUsers from 'src/pages/SocialMedia/sub-pages/AllUsers'
import CreatePost from 'src/pages/SocialMedia/sub-pages/CreatePost'
import EditPost from 'src/pages/SocialMedia/sub-pages/EditPost'
import Explore from 'src/pages/SocialMedia/sub-pages/Explore'
import Home from 'src/pages/SocialMedia/sub-pages/Home'
import PostDetails from 'src/pages/SocialMedia/sub-pages/PostDetails'
import Profile from 'src/pages/SocialMedia/sub-pages/Profile'
import Saved from 'src/pages/SocialMedia/sub-pages/Saved'

const socialRouter = {
  path: path.social,
  element: <SocialLayout />,
  children: [
    {
      path: path.social,
      element: (
        <Suspense>
          <Home />
        </Suspense>
      )
    },
    {
      path: path.explore,
      element: (
        <Suspense>
          <Explore />
        </Suspense>
      )
    },
    {
      path: path.saved,
      element: (
        <Suspense>
          <Saved />
        </Suspense>
      )
    },
    {
      path: path.allUsers,
      element: (
        <Suspense>
          <AllUsers />
        </Suspense>
      )
    },
    {
      path: path.createPost,
      element: (
        <Suspense>
          <CreatePost />
        </Suspense>
      )
    },
    {
      path: path.updatePost,
      element: (
        <Suspense>
          <EditPost />
        </Suspense>
      )
    },
    {
      path: path.postDetail,
      element: (
        <Suspense>
          <PostDetails />
        </Suspense>
      )
    },
    {
      path: path.socialProfile,
      element: (
        <Suspense>
          <Profile />
        </Suspense>
      )
    }
  ]
}

export default socialRouter
