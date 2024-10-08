import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useParams } from 'react-router-dom'
import chatApi from 'src/apis/chat.api'
import { ConversationResponse } from 'src/types/chat.type'
import { Pagination, SuccessResponse } from 'src/types/utils.type'

export function useConversationById(): {
  isLoading: boolean
  conversation: ConversationResponse
  error?: Error | null
} {
  const { conversationId } = useParams<{ conversationId: string }>()

  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<ConversationResponse>>, Error> = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => chatApi.getConversationById(conversationId!),
    enabled: !!conversationId
  })

  const conversation = data?.data?.body || ({} as ConversationResponse)

  return {
    isLoading,
    conversation,
    error
  }
}
