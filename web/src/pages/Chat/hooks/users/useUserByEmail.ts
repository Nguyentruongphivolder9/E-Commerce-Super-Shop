import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import chatApi from 'src/apis/chat.api'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'

export function useUserByEmail(email: string | undefined): {
  isLoading: boolean
  data?: AxiosResponse<SuccessResponse<User>>
  user: any
  error?: Error | null
} {
  const {
    isPending: isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<User>>, Error> = useQuery({
    queryKey: ['user', email],
    queryFn: () => chatApi.getUserByEmail(email!),
    enabled: !!email
  })

  const user = data?.data?.body || ({} as User)

  return {
    isLoading,
    data,
    user,
    error
  }
}
