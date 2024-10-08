import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import chatApi from 'src/apis/chat.api'
import { MessageResponse } from 'src/types/chat.type'
import { SuccessResponse } from 'src/types/utils.type'

export function useMessageById(messageId: string) {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<MessageResponse>>, Error> = useQuery({
    queryKey: ['message', messageId],
    queryFn: () => chatApi.getMessageById(messageId),
    enabled: !!messageId
  })

  const message = data?.data?.body || ({} as MessageResponse)

  return {
    isLoading,
    message,
    error
  }
}
