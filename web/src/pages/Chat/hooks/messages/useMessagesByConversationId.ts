import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'
import chatApi from 'src/apis/chat.api'
import { MessageResponse } from 'src/types/chat.type'
import { SuccessResponse } from 'src/types/utils.type'

export function useMessagesByConversationId() {
  const { conversationId } = useParams<{ conversationId: string }>()

  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<MessageResponse[]>>, Error> = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatApi.getMessages(conversationId!),
    enabled: !!conversationId
  })

  const messages = data?.data?.body || ([] as MessageResponse[])

  return {
    isLoading,
    messages,
    error
  }
}
