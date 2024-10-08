import { useParams, Link, useNavigate } from 'react-router-dom'
import { closeModal, modals } from '@mantine/modals'
import { Button } from 'src/components/ui'
import { Loader, PostStats } from 'src/components/shared'

import { useGetPostById, useDeletePost } from 'src/lib/socialQueries/queries'
import { multiFormatDateString } from 'src/lib/utils'
import { useContext, useRef } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import config from 'src/constants/config'
import { Image, Text } from '@mantine/core'
import { toast } from 'react-toastify'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'

const PostDetails = () => {
  const navigate = useNavigate()
  const { postId } = useParams()
  const { profile: user } = useContext(AppContext)
  const { user: currentUser } = useUserByEmail(user?.email)
  const autoplay = useRef(Autoplay({ delay: 2000 }))

  const { post, isLoading } = useGetPostById(postId)
  const { mutate: deletePost } = useDeletePost()

  // const relatedPosts = userPosts?.documents.filter((userPost) => userPost.$id !== id)

  const handleDeletePost = () => {
    deletePost({ postId: postId! })
    toast.success('Post deleted successfully')
    navigate(-1)
  }

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: 'Delete your Post',
      centered: true,
      children: (
        <Text size='sm'>
          Are you sure you want to delete your post? This action is destructive and you will have to contact support to
          restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete post', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => closeModal,
      onConfirm: () => handleDeletePost()
    })

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
    <div className='post_details-container'>
      <div className='hidden md:flex max-w-5xl w-full'>
        <Button onClick={() => navigate(-1)} variant='ghost' className='shad-button_ghost'>
          <img src={'/assets/icons/back.svg'} alt='back' width={24} height={24} />
          <p className='small-medium lg:base-medium'>Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className='post_details-card'>
          {/* <img src={post?.} alt='creator' className='post_details-img' /> */}
          <Carousel
            withIndicators
            height='100%'
            style={{ flex: 1 }}
            loop
            controlSize={40}
            // height={400}
            slideGap='xl'
            plugins={[autoplay.current]}
            onMouseEnter={autoplay.current.stop}
            onMouseLeave={autoplay.current.reset}
            className='post_details-img'
          >
            {slides}
          </Carousel>

          <div className='post_details-info'>
            <div className='flex-between w-full'>
              <Link to={`/social/profile/${currentUser._id}`} className='flex items-center gap-3'>
                <img
                  src={post?.creatorAvatarUrl || '/assets/icons/profile-placeholder.svg'}
                  alt='creator'
                  className='w-8 h-8 lg:w-12 lg:h-12 rounded-full'
                />
                <div className='flex gap-1 flex-col'>
                  <p className='base-medium lg:body-bold text-light-1'>{post?.creatorName}</p>
                  <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular '>{multiFormatDateString(post?.createdAt)}</p>•
                    <p className='subtle-semibold lg:small-regular'>{post?.location}</p>
                  </div>
                </div>
              </Link>

              <div className='flex-center gap-4'>
                <Link to={`/update-post/${post?.id}`} className={`${user?._id !== post?.creatorId && 'hidden'}`}>
                  <img src={'/assets/icons/edit.svg'} alt='edit' width={24} height={24} />
                </Link>

                <Button
                  onClick={openDeleteModal}
                  variant='ghost'
                  className={`ost_details-delete_btn ${user?._id !== post?.creatorId && 'hidden'}`}
                >
                  <img src={'/assets/icons/delete.svg'} alt='delete' width={24} height={24} />
                </Button>
              </div>
            </div>

            <hr className='border w-full border-dark-4/80' />

            <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
              <p>{post?.caption}</p>
              <ul className='flex gap-1 mt-2'>
                <div className='small-medium lg:base-medium py-5'>
                  <p className='flex gap-1 mt-2 text-light-3 small-regular'>#{post?.tags}</p>
                </div>
              </ul>
            </div>

            <div className='w-full'>{user && <PostStats post={post} user={user} />}</div>
          </div>
        </div>
      )}

      <div className='w-full max-w-5xl'>
        <hr className='border w-full border-dark-4/80' />

        <h3 className='body-bold md:h3-bold w-full my-10'>More Related Posts</h3>
        {/* { !relatedPosts ? <Loader /> : <GridPostList posts={relatedPosts} />} */}
      </div>
    </div>
  )
}

export default PostDetails
