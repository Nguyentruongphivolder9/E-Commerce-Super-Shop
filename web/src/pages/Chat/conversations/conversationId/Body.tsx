import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { MessageResponse } from 'src/types/chat.type'
import useConversationRoutes from '../../hooks/conversations/useConversationRoutes'
import MessageBox from './MessageBox'
import { IMessage, messageCallbackType, useSubscription } from 'react-stomp-hooks'
import { find } from 'lodash'
import { AppContext } from 'src/contexts/app.context'
import { useUserByEmail } from '../../hooks/users/useUserByEmail'
import LoadingModal from '../../components/LoadingModal'

interface BodyProps {
  initialMessages: MessageResponse[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  // console.log(initialMessages)
  const { profile } = useContext(AppContext)
  const { isLoading, user } = useUserByEmail(profile?.email)
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversationRoutes()

  const accountId = useMemo(() => {
    return user?._id
  }, [user])

  useEffect(() => {
    setMessages(initialMessages)
  }, [initialMessages])

  // useEffect(() => {
  //   axios.post(`/api/conversations/${conversationId}/seen`)
  // }, [conversationId])

  const messageHandler: messageCallbackType = (message: IMessage) => {
    // axios.post(`/api/conversations/${conversationId}/seen`)
    const newMessage: MessageResponse = JSON.parse(message.body)
    console.log(message)

    setMessages((current) => {
      if (find(current, { id: newMessage.id })) {
        return current
      }

      return [...current, newMessage]
    })

    bottomRef?.current?.scrollIntoView()
  }

  const updateMessageHandler: messageCallbackType = (message: IMessage) => {
    const newMessage: MessageResponse = JSON.parse(message.body)

    setMessages((current) =>
      current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage
        }

        return currentMessage
      })
    )
  }

  useSubscription(`/user/${accountId}/conversation/${conversationId}/message/new`, messageHandler)
  useSubscription(`/user/${accountId}/conversation/${conversationId}/message/update`, updateMessageHandler)

  if (isLoading) return <LoadingModal />

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages?.map((message, i) => <MessageBox isLast={i === messages.length - 1} key={message.id} data={message} />)}
      <div ref={bottomRef} className='pt-24'></div>
    </div>
  )
}

export default Body
