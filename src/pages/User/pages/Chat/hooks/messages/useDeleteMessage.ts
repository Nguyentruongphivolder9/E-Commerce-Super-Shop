import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  const { isPending: isDeleting, mutate: deleteMessage } = useMutation({
    mutationFn: chatApi.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isDeleting, deleteMessage }
}
