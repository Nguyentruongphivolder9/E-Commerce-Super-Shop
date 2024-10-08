import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea
} from 'src/components/ui'
import { PostValidation } from 'src/utils/validations/socialValidation'
import { useToast } from 'src/components/ui/use-toast'

import { FileUploader, Loader } from 'src/components/shared'
import { useCreatePost, useUpdatePost } from 'src/lib/socialQueries/queries'
import { AppContext } from 'src/contexts/app.context'
import { useContext, useEffect } from 'react'
import { Post } from 'src/types/social.type'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'

type PostFormProps = {
  post?: Post
  action: 'Create' | 'Update'
}

export type PostFormSchema = yup.InferType<typeof PostValidation>

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate()

  const { toast } = useToast()
  const { profile } = useContext(AppContext)
  const { isLoading, user } = useUserByEmail(profile?.email)
  const form = useForm<PostFormSchema>({
    resolver: yupResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      location: post ? post.location : '',
      tags: post ? post.tags : ''
    },
    mode: 'onChange'
  })

  useEffect(() => {
    if (post) {
      form.setValue('caption', post.caption)
      form.setValue('location', post.location)
      form.setValue('tags', post.tags)
    }
  }, [post, form])

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost()

  // Handler
  const handleSubmit = async (value: yup.InferType<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === 'Update') {
      const updatedPost = await updatePost({
        ...value,
        postId: post.id,
        caption: value.caption || '',
        postImages: (value.postImages ?? []).filter((f): f is File => f !== undefined),
        creatorId: user?._id
      })
      // const updatedPost = await updatePost({
      //   ...value,
      //   postId: post.$id,
      //   imageId: post.imageId,
      //   imageUrl: post.imageUrl,
      //   caption: value.caption || ''
      // })

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`
        })
      }
      return navigate(`/social/posts/${post.id}`)
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...value,
      caption: value.caption || '',
      creatorId: user?._id,
      postImages: (value.postImages ?? []).filter((f): f is File => f !== undefined)
    })

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`
      })
    }
    navigate('/social')
  }
  //src={`${config.awsURL}posts/${post.postImages[0].imageUrl}`}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-9 w-full  max-w-5xl'>
        <FormField
          control={form.control}
          name='caption'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea custom-scrollbar' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='postImages'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.postImageResponses ?? []} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='location'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Tags (separated by comma )</FormLabel>
              <FormControl>
                <Input placeholder='Art, Expression, Learn' type='text' className='shad-input' {...field} />
              </FormControl>
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

        <div className='flex gap-4 items-center justify-end'>
          <Button type='button' className='shad-button_dark_4' onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type='submit'
            className='shad-button_primary whitespace-nowrap'
            disabled={isLoadingCreate || isLoadingUpdate || isLoading}
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
