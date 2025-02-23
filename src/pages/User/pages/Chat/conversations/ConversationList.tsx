import clsx from 'clsx'
import { useContext, useEffect, useMemo, useState } from 'react'
import ConversationBox from './ConversationBox'

import { User } from 'src/types/user.type'
import { ConversationResponse } from 'src/types/chat.type'
import { useNavigate } from 'react-router-dom'
import useConversationRoutes from '../hooks/conversations/useConversationRoutes'
import { AppContext } from 'src/contexts/app.context'
import { IMessage, messageCallbackType, useSubscription } from 'react-stomp-hooks'
import { find } from 'lodash'
import { useMessagesByConversationId } from '../hooks/messages/useMessagesByConversationId'
import { useUserByEmail } from '../hooks/users/useUserByEmail'

// interface ConversationListProps {
//   initialItems: FullConversationType[]
//   users: User[]
// }

interface ConversationListProps {
  initialItems: ConversationResponse[]
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }: ConversationListProps) => {
  // const session = useSession()
  const { profile } = useContext(AppContext)
  const { isLoading, user } = useUserByEmail(profile?.email)

  const [items, setItems] = useState(initialItems)
  const { messages: listMessages, isLoading: isLoadingMessages } = useMessagesByConversationId()
  const { conversationId, isOpen } = useConversationRoutes()
  const navigate = useNavigate()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const accountId = useMemo(() => {
    return user?.id
  }, [user?.id])

  const newHandler: messageCallbackType = (message: IMessage) => {
    const conversation: ConversationResponse = JSON.parse(message.body)
    setItems((current) => {
      if (find(current, { id: conversation.id })) {
        return current
      }

      return [conversation, ...current]
    })
  }

  const updateHandler: messageCallbackType = (message: IMessage) => {
    const conversation: ConversationResponse = JSON.parse(message.body)
    setItems((current) =>
      current.map((currentConversation) => {
        if (currentConversation.id === conversation.id || !isLoadingMessages) {
          return {
            ...currentConversation,
            messages: listMessages
          }
        }

        return currentConversation
      })
    )
  }

  const removeHandler: messageCallbackType = (message: IMessage) => {
    const conversation: ConversationResponse = JSON.parse(message.body)
    setItems((current) => {
      return [...current.filter((con) => con.id !== conversation.id)]
    })

    if (conversationId === conversation.id) {
      navigate('/chat/conversations')
    }
  }

  useSubscription(`/user/${accountId}/conversation/new`, newHandler)
  useSubscription(`/user/${accountId}/conversation/update`, updateHandler)
  useSubscription(`/user/${accountId}/conversation/delete`, removeHandler)

  return (
    <>
      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200
        `,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4'>
            <div
              className='
              text-2xl
              font-bold
              text-neutral-800
            '
            >
              Conversations
            </div>
          </div>

          {items?.map((item) => <ConversationBox key={item.id} data={item} selected={conversationId === item.id} />)}
        </div>
      </aside>
    </>
  )
}

export default ConversationList
