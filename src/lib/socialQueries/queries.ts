import { useQuery, useMutation, useQueryClient, useInfiniteQuery, UseQueryResult } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import socialApi from 'src/apis/social.api'

import { QUERY_KEYS } from 'src/lib/socialQueries/queryKeys'

import { INewPost, IUpdatePost, Post, SavePost } from 'src/types/social.type'
import { Pagination, SuccessResponse } from 'src/types/utils.type'

// ============================================================
// POST QUERIES
// ============================================================

export const useGetPosts = () => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }) => socialApi.getInfinitePosts({ pageParam: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.data?.body?.nextPage
  })

  return {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  }
}

export const useSearchPosts = (searchTerm: string) => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Pagination<Post[]>>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => socialApi.searchPosts(searchTerm),
    enabled: !!searchTerm
  })

  const posts = data?.data?.body?.content || []

  return {
    isLoading,
    posts,
    error
  }
}

//done
export const useGetRecentPosts = () => {
  const {
    isLoading,
    data,
    error,
    isError
  }: UseQueryResult<AxiosResponse<SuccessResponse<Pagination<Post[]>>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: socialApi.getRecentPosts
  })

  const posts = data?.data?.body?.content || []

  return {
    isLoading,
    posts,
    error,
    isError
  }
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: INewPost) => socialApi.createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER_POSTS]
      })
    }
  })
}

//done
interface UseGetPostByIdResult {
  post: Post | null
  isLoading: boolean
  error: any
}

//done
export const useGetPostById = (postId?: string): UseGetPostByIdResult => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Post>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => socialApi.getPostById(postId),
    enabled: !!postId
  })

  const post = data?.data?.body || null

  return {
    isLoading,
    post,
    error
  }
}

export const useGetUserPosts = (userId: string) => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Post[]>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => socialApi.getUserPosts(userId),
    enabled: !!userId
  })

  const posts = data?.data?.body || []

  return {
    isLoading,
    posts,
    error
  }
}

//done
export const useGetCurrentUserPosts = () => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Post[]>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER_POSTS],
    queryFn: socialApi.getCurrentUserPosts
  })

  return {
    isLoading,
    posts: data?.data?.body || [],
    error
  }
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: IUpdatePost) => socialApi.updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.data?.body?.id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
    }
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => socialApi.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIKED_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS]
      })
    }
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => socialApi.likePost(postId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.data?.body]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_LIKED_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS]
      })
    }
  })
}

export const useGetLikedPosts = (userId: string) => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Post[]>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_LIKED_POSTS, userId],
    queryFn: () => socialApi.getLikedPosts(userId),
    enabled: !!userId
  })

  const posts = data?.data?.body || []

  return {
    isLoading,
    posts,
    error
  }
}

export const useSavePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => socialApi.savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId }: { postId: string }) => socialApi.deleteSavedPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }
  })
}

export const useGetUserSavedIdPosts = () => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<SavePost[]>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SAVED_ID_POSTS],
    queryFn: socialApi.getUserSavedIdPosts
  })

  const savedPosts = data?.data?.body || []

  return {
    isLoading,
    savedPosts,
    error
  }
}

export const useGetUserSavedPosts = () => {
  const {
    isLoading,
    data,
    error
  }: UseQueryResult<AxiosResponse<SuccessResponse<Post[]>>, Error> = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_SAVED_POSTS],
    queryFn: socialApi.getUserSavedPosts
  })

  const savedPosts = data?.data?.body || []

  return {
    isLoading,
    savedPosts,
    error
  }
}
