import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { StompSessionProvider } from 'react-stomp-hooks'

import config from 'src/constants/config'
import LoadingModal from 'src/pages/Chat/components/LoadingModal'
import Sidebar from 'src/pages/Chat/components/sidebar/Sidebar'
import ConversationList from 'src/pages/Chat/conversations/ConversationList'
import { useConversations } from 'src/pages/Chat/hooks/conversations/useConversations'
import { useUsers } from 'src/pages/Chat/hooks/users/useUsers'

export default function ChatLayout() {
  const [enabled, setEnabled] = useState(true)
  const { isLoading, conversations } = useConversations()

  const { isLoading: isPending, users } = useUsers()

  if (isLoading || isPending) {
    return <LoadingModal />
  }

  return (
    <StompSessionProvider
      url={config.CHAT_WEBSOCKET_URL}
      debug={(str) => {
        console.log(str)
      }}
    >
      <Sidebar>
        <div className='h-full'>
          <ConversationList users={users!} initialItems={conversations!} />
          <Outlet />
        </div>
      </Sidebar>
    </StompSessionProvider>
    // <StompSessionProvider
    //   url={config.CHAT_WEBSOCKET_URL}
    //   debug={(str) => {
    //     console.log(str)
    //   }}
    //   enabled={enabled}
    // >
    //   <Checkbox checked={enabled} onChange={(event) => setEnabled(event.target.checked)} label='Enabled' />
    //   <ChildComponent />
    //   {/* <PublishComponent /> */}
    // </StompSessionProvider>
  )
}
