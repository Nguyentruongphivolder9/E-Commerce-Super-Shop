import { ScrollArea } from '@mantine/core'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { MessageResponse } from 'src/types/chat.type'
import useConversationRoutes from './hooks/conversations/useConversationRoutes'
import { IMessage, messageCallbackType, useSubscription } from 'react-stomp-hooks'

interface Props {
  recipientId: string | null
}

export default function ConversationContent({ recipientId } : Props) {
  const { profile } = useContext(AppContext)
  // const { messages, isLoading: isLoadingMessages } = useMessagesByConversationId()
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversationRoutes()

  const accountId = useMemo(() => {
    return profile?.id
  }, [profile])

  // useEffect(() => {
  //   setMessages(initialMessages)
  // }, [initialMessages])

  const messageHandler: messageCallbackType = (message: IMessage) => {
    const newMessage: MessageResponse = JSON.parse(message.body)

    // setMessages((current) => {
    //   if (find(current, { id: newMessage.id })) {
    //     return current
    //   }

    //   return [...current, newMessage]
    // })

    bottomRef?.current?.scrollIntoView()
  }

  const updateMessageHandler: messageCallbackType = (message: IMessage) => {
    const newMessage: MessageResponse = JSON.parse(message.body)

    // setMessages((current) =>
    //   current.map((currentMessage) => {
    //     if (currentMessage.id === newMessage.id) {
    //       return newMessage
    //     }

    //     return currentMessage
    //   })
    // )
  }

  useSubscription(`/user/${accountId}/conversation/${conversationId}/message/new`, messageHandler)
  useSubscription(`/user/${accountId}/conversation/${conversationId}/message/update`, updateMessageHandler)

  return (
    <ScrollArea className='h-full' type='always' scrollbarSize={8}>
      <div className='px-4'>
        <div className='flex my-1 justify-start'>
          <div className='h-auto w-[312px] px-2 pt-2 pb-1 rounded-md flex flex-col bg-white overflow-hidden'>
            <div className='text-dark-3 text-sm'>
              Xin chào, hậu cần cho thấy gói hàng của bạn đã được nhận, nếu bạn gặp bất kỳ vấn đề gì trong quá trình sử
              dụng, vui lòng liên hệ với tôi trong thời gian sớm nhất. Tôi sẽ tích cực giải quyết vấn đề cho bạn. Hy
              vọng sản phẩm của chúng tôi có thể mang lại cho bạn trải nghiệm tốt
            </div>
            <div className='text-xs text-dark-5 justify-end flex'>15:45</div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
