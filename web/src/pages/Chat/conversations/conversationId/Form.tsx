import axios from 'axios'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import MessageInput from './MessageInput'

import { HiPaperAirplane } from 'react-icons/hi'
import { HiPhoto } from 'react-icons/hi2'
import useConversationRoutes from '../../hooks/conversations/useConversationRoutes'

import { useSendMessage } from '../../hooks/messages/useSendMessage'

const Form = () => {
  const { conversationId } = useConversationRoutes()
  const { isSending, sendMessage } = useSendMessage()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      body: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue('body', '', { shouldValidate: true })

    sendMessage(
      {
        body: data.body,
        image: '',
        conversationId
      },
      {
        onSuccess: () => {
          setValue('body', '', { shouldValidate: true })
        }
      }
    )
  }

  // const handleUpload = (result: any) => {
  //   axios.post('/api/messages', {
  //     image: result?.info?.secure_url,
  //     conversationId
  //   })
  // }

  return (
    <div
      className='
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
  '
    >
      {/* <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset='lgxlav1q'>
        <HiPhoto size={30} className='text-sky-500' />
      </CldUploadButton> */}
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
        <MessageInput id='body' register={register} errors={errors} required placeholder='Write a message' />
        <button
          disabled={isSending}
          type='submit'
          title='Send'
          className='
            rounded-full
            p-2
          bg-sky-500
            cursor-pointer
          hover:bg-sky-600
            transition'
        >
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  )
}

export default Form
