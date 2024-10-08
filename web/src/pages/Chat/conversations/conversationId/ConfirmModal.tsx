import { DialogTitle } from '@headlessui/react'
import axios from 'axios'

import { useCallback, useState } from 'react'

import { FiAlertTriangle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import useConversationRoutes from '../../hooks/conversations/useConversationRoutes'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal'
import Button from '../../components/Button'
import { useDeleteConversation } from '../../hooks/conversations/useDeleteConversation'
import { useConversations } from '../../hooks/conversations/useConversations'
import { Conversation } from 'src/types/chat.type'

interface ConfirmModalProps {
  isOpen?: boolean
  onClose: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }: ConfirmModalProps) => {
  const navigate = useNavigate()
  const { conversationId } = useConversationRoutes()
  const { isDeleting, deleteConversation } = useDeleteConversation()

  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteConversation = useCallback(async () => {
    setIsLoading(true)
    try {
      deleteConversation(conversationId)

      onClose()
      navigate('/chat/conversations')
    } catch (error) {
      toast.error('Failed to delete conversation')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, deleteConversation, navigate, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div
          className='
            mx-auto
            flex
            h-12
            w-12
            flex-shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-100
            sm:mx-0
            sm:h-10
            sm:w-10
        '
        >
          <FiAlertTriangle className='h-6 w-6 text-red-600' />
        </div>
        <div
          className='
        mt-3
        text-center
        sm:ml-4
        sm:mt-0
        sm:text-left'
        >
          <DialogTitle
            as='h3'
            className='
            text-lg
            leading-6
            font-medium
            text-gray-900
            sm:text-xl
        '
          >
            Delete Conversation
          </DialogTitle>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>
              Are you sure you want to delete this conversation? All of your data will be permanently removed. This
              action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        <Button disabled={isLoading || isDeleting} danger onClick={handleDeleteConversation}>
          Delete
        </Button>
        <Button disabled={isLoading || isDeleting} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
