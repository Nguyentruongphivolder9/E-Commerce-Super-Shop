import { useQueries, useQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import chatApi from 'src/apis/chat.api'
import { User } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'

export function useUserById(userId: string): {
  isLoading: boolean
  user: User
  error?: Error | null
} {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<User>>, Error> = useQuery({
    queryKey: ['user', userId],
    queryFn: () => chatApi.getUserById(userId),
    enabled: !!userId
  })

  const user = data?.data?.body || ({} as User)

  return {
    isLoading,
    user,
    error
  }
}

export function useUsersByAccountIds(accountIds: string[]): {
  isLoading: boolean
  users: User[]
  error?: Error
} {
  const queries = useQueries({
    queries: accountIds?.map((accountId) => ({
      queryKey: ['user', accountId],
      queryFn: () => chatApi.getUserById(accountId),
      staleTime: Infinity,
      enabled: !!accountId || accountIds.length > 0
    }))
  }) as UseQueryResult<AxiosResponse<SuccessResponse<User[]>>, Error>[]

  const isLoading = queries.some((query) => query.isLoading)
  const error = queries.find((query) => query.error)?.error || undefined
  const users: User[] = queries.map((query) => query.data?.data?.body || []).flat()

  return {
    isLoading,
    users,
    error
  }
}
