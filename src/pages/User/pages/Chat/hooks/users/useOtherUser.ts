import { ConversationResponse } from 'src/types/chat.type'

import chatApi from 'src/apis/chat.api'
import { useQuery } from '@tanstack/react-query'

const useOtherUser = (conversation: ConversationResponse) => {
  const { id } = conversation

  const { isLoading, data, error } = useQuery({
    queryKey: ['otherUser', id],
    queryFn: () => chatApi.getOtherUser(id),
    enabled: !!id
  })

  const otherUser = data?.data?.body

  return {
    isLoading,
    otherUser,
    error
  }
}

export default useOtherUser
