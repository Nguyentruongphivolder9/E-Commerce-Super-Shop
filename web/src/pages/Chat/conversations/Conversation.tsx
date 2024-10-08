import EmptyState from '../components/EmptyState'
import LoadingModal from '../components/LoadingModal'
import { useConversationById } from '../hooks/conversations/useConversationById'
import { useMessagesByConversationId } from '../hooks/messages/useMessagesByConversationId'

import Body from './conversationId/Body'
import Form from './conversationId/Form'
import Header from './conversationId/Header'

const ConversationId = () => {
  const { conversation, isLoading } = useConversationById()

  const { messages, isLoading: isLoadingMessages } = useMessagesByConversationId()

  if (isLoading || isLoadingMessages) {
    return <LoadingModal />
  }

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <Header conversation={conversation!} />
        <Body initialMessages={messages!} />

        <Form />
      </div>
    </div>
  )
}

export default ConversationId
