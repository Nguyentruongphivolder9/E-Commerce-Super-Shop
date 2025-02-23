import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import chatApi from 'src/apis/chat.api'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'

export function useUsers() {
  const {
    isLoading,
    data,
    error,
    isError
  }: UseQueryResult<AxiosResponse<SuccessResponse<User[]>>, Error> = useQuery({
    queryKey: ['users'],
    queryFn: chatApi.getUsers
  })

  const users = data?.data?.body || []

  return {
    isLoading,
    users,
    error,
    isError
  }
}
