import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import chatApi from 'src/apis/chat.api'

import { ConversationResponse } from 'src/types/chat.type'
import { Pagination, SuccessResponse } from 'src/types/utils.type'

export function useConversations() {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Pagination<ConversationResponse[]>>>, Error> = useQuery({
    queryKey: ['conversations'],
    queryFn: chatApi.getConversations
  })

  const conversations = data?.data?.body?.content

  return {
    isLoading,
    conversations,
    error
  }
}
