import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { useContext, useRef } from 'react'
import { Link } from 'react-router-dom'

import { PostStats } from 'src/components/shared'
import config from 'src/constants/config'
import { AppContext } from 'src/contexts/app.context'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'
import { Post } from 'src/types/social.type'

type GridPostListProps = {
  posts: Post[]
  showUser?: boolean
  showStats?: boolean
}

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { profile } = useContext(AppContext)
  const { user } = useUserByEmail(profile?.email || '')

  const autoplay = useRef(Autoplay({ delay: 2000 }))

  return (
    <ul className='grid-container'>
      {posts.map((post) => (
        <li key={post.id} className='relative min-w-80 h-80'>
          {/* <img src={post.postImageResponses} alt='post' className='h-full w-full object-cover' /> */}
          <div className='grid-post_link'>
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
              {post?.postImageResponses?.map((postImage) => (
                <Carousel.Slide key={postImage?.id}>
                  <Image
                    src={`${config.awsURL}posts/${postImage?.imageUrl}` || '/assets/icons/profile-placeholder.svg'}
                    height={220}
                    className='post-card_img'
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>

          <Link to={`/social/posts/${post.id}`}>
            <div className='grid-post_user'>
              {showUser && (
                <div className='flex items-center justify-start gap-2 flex-1'>
                  <img
                    src={post.creatorAvatarUrl || '/assets/icons/profile-placeholder.svg'}
                    alt='creator'
                    className='w-8 h-8 rounded-full'
                  />
                  <p className='line-clamp-1'>{post.creatorName}</p>
                </div>
              )}
            </div>
          </Link>

          {showStats && <PostStats post={post} user={user} />}
        </li>
      ))}
    </ul>
  )
}

export default GridPostList
