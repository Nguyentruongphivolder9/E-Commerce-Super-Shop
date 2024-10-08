import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { User } from 'src/types/user.type'
import Modal from '../components/Modal'

import Select from '../components/input/Select'
import Input from '../components/input/Input'
import Button from '../components/Button'

import { useCreateConversation } from '../hooks/conversations/useCreateConversation'

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

// type FormData = ConversationSchema

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users }: GroupChatModalProps) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { isCreating, createConversation } = useCreateConversation()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      isGroup: true,
      messageIds: [],
      accountEmails: []
    }
  })

  const accountEmails = watch('accountEmails')

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    // Transform accountEmails to extract only email values
    const emailValues = data.accountEmails.map((emailObj: { value: string }) => emailObj.value)

    createConversation(
      {
        ...data,
        name: data.name || '',
        isGroup: true,
        messageIds: [],
        accountEmails: emailValues || []
      },
      {
        onSuccess: () => {
          navigate('/chat/conversations')
          reset()
          onClose()
        },
        onError: (err) => toast.error(err.message)
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2
              className='
                text-base
                font-semibold
                leading-7
                text-gray-900
              '
            >
              Create a group chat
            </h2>
            <p
              className='
                mt-1
                text-sm
                leading-6
                text-gray-600
              '
            >
              Create a chat with more than 2 people.
            </p>
            <div
              className='
                mt-10
                flex
                flex-col
                gap-y-8
              '
            >
              <Input register={register} label='Name' id='name' disabled={isLoading} required errors={errors} />
              <Select
                disabled={isLoading}
                label='Members'
                options={users?.map((user) => ({
                  value: user.email,
                  label: user.userName
                }))}
                onChange={(value) =>
                  setValue('accountEmails', Object.values(value), {
                    shouldValidate: true
                  })
                }
                value={accountEmails}
              />
            </div>
          </div>
        </div>
        <div
          className='
            mt-6
            flex
            items-center
            justify-end
            gap-x-6
          '
        >
          <Button disabled={isLoading} onClick={onClose} type='button' secondary>
            Cancel
          </Button>
          <Button disabled={isLoading || isCreating} type='submit'>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal
