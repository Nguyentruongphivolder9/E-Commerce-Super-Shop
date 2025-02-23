import { Textarea, Tooltip } from '@mantine/core'
import { IconPhoto, IconReceipt, IconSend2, IconShoppingBag } from '@tabler/icons-react'
import { FieldErrors, FieldValues, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import useConversationRoutes from './hooks/conversations/useConversationRoutes'
import { useSendMessage } from './hooks/messages/useSendMessage'

interface MessageInputProps {
  placeholder?: string
  id: string
  type?: string
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

export default function InputChat() {
  const { conversationId } = useConversationRoutes()
  // const { isSending, sendMessage } = useSendMessage()

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

    console.log(data)

    // sendMessage(
    //   {
    //     body: data.body,
    //     image: '',
    //     conversationId
    //   },
    //   {
    //     onSuccess: () => {
    //       setValue('body', '', { shouldValidate: true })
    //     }
    //   }
    // )
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='w-full h-full'>
        <div className='p-2 h-[58px]'>
          <Textarea
            {...register('body')}
            className='w-full h-full'
            variant='unstyled'
            size='none'
            placeholder='Nhập nội dung tin nhắn'
          />
        </div>
        <div className='h-[30px] px-2 pb-3 flex justify-between'>
          <div className='flex gap-2'>
            <Tooltip label='Hình ảnh'>
              <IconPhoto className='text-icon-1' stroke={2.5} width={'18'} />
            </Tooltip>
            <Tooltip label='Sản phẩm'>
              <IconShoppingBag className='text-icon-1' stroke={2.5} width={'18'} />
            </Tooltip>
            <Tooltip label='Đơn hàng'>
              <IconReceipt className='text-icon-1' stroke={2.5} width={'18'} />
            </Tooltip>
          </div>
          <button type='submit'>
            <IconSend2 width={'18'} className='text-icon-1' />
          </button>
        </div>
      </div>
    </form>
  )
}
