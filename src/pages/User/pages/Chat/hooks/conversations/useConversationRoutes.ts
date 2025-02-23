import { useParams } from 'react-router-dom'
import { useMemo } from 'react'

const useConversationRoutes = () => {
  const params = useParams<{ conversationId?: string }>()

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return ''
    }

    return params.conversationId as string
  }, [params?.conversationId])

  const isOpen = useMemo(() => !!conversationId, [conversationId])

  return useMemo(() => ({ isOpen, conversationId }), [isOpen, conversationId])
}

export default useConversationRoutes
