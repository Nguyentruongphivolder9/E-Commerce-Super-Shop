import { useMemo } from 'react'
import { HiChat } from 'react-icons/hi'
import { HiUsers } from 'react-icons/hi2'
import useConversationRoutes from '../conversations/useConversationRoutes'
import { useLocation } from 'react-router-dom'

const useRoutes = () => {
  const location = useLocation()
  const { conversationId } = useConversationRoutes()

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/chat/conversations',
        icon: HiChat,
        active: location.pathname === '/conversations' || !!conversationId
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: location.pathname === '/users'
      }
    ],
    [location.pathname, conversationId]
  )

  return routes
}

export default useRoutes
