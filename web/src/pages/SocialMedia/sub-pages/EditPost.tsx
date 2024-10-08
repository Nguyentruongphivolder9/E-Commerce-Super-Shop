import { useParams } from 'react-router-dom'

import { Loader } from 'src/components/shared'
import PostForm from 'src/components/forms/PostForm'
import { useGetPostById } from 'src/lib/socialQueries/queries'

const EditPost = () => {
  const { postId: id } = useParams<{ postId: string }>()
  const { post, isLoading } = useGetPostById(id)

  if (isLoading)
    return (
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='flex-start gap-3 justify-start w-full max-w-5xl'>
          <img src='/assets/icons/edit.svg' width={36} height={36} alt='edit' className='invert-white' />
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit Post</h2>
        </div>

        {isLoading ? <Loader /> : <PostForm action='Update' post={post ?? undefined} />}
      </div>
    </div>
  )
}

export default EditPost
