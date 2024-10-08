import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'

import { PostStats } from 'src/components/shared'
import '@mantine/carousel/styles.css'
import { AppContext } from 'src/contexts/app.context'
import { multiFormatDateString } from 'src/lib/utils'
import { Post } from 'src/types/social.type'
import config from 'src/constants/config'
import { Image } from '@mantine/core'
import { Carousel } from '@mantine/carousel'

import Autoplay from 'embla-carousel-autoplay'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'

type PostCardProps = {
  post: Post
}

const PostCard = ({ post }: PostCardProps) => {
  const { profile } = useContext(AppContext)
  const { isLoading, user } = useUserByEmail(profile?.email)

  const autoplay = useRef(Autoplay({ delay: 2000 }))

  if (!post.creatorId || isLoading) return
  const slides = post?.postImageResponses?.map((postImage) => (
    <Carousel.Slide key={postImage?.id}>
      <Image
        src={`${config.awsURL}posts/${postImage?.imageUrl}` || '/assets/icons/profile-placeholder.svg'}
        height={220}
        className='post-card_img'
      />
    </Carousel.Slide>
  ))

  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <Link to={`/social/profile/${user._id}`}>
            <img
              src={post?.creatorAvatarUrl || '/assets/icons/profile-placeholder.svg'}
              alt='creator'
              className='w-12 lg:h-12 rounded-full'
            />
          </Link>

          <div className='flex flex-col'>
            <p className='base-medium lg:body-bold text-light-1'>{post.creatorName}</p>
            <div className='flex-center gap-2 text-light-3'>
              <p className='subtle-semibold lg:small-regular '>{multiFormatDateString(post.createdAt)}</p>•
              <p className='subtle-semibold lg:small-regular'>{post.location}</p>
            </div>
          </div>
        </div>

        <Link to={`/social/update-post/${post?.id}`} className={`${user?._id !== post?.creatorId && 'hidden'}`}>
          <img src={'/assets/icons/edit.svg'} alt='edit' width={20} height={20} />
        </Link>
      </div>

      <Link to={`/social/posts/${post?.id}`}>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post.caption}</p>
          <p className='flex gap-1 mt-2 text-light-3 small-regular'>#{post?.tags}</p>
        </div>
      </Link>

      <div>
        {slides.length > 1 && (
          <Carousel
            withIndicators
            height='100%'
            style={{ flex: 1 }}
            loop
            controlSize={40}
            // height={400}
            slideGap='xs'
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
          >
            {slides}
          </Carousel>
        )}
      </div>

      <div className='mt-7'>
        <PostStats post={post} user={user} />
      </div>
    </div>
  )
}

export default PostCard
