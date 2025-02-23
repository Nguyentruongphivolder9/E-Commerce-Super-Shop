import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'

export function useDeleteConversation() {
  const queryClient = useQueryClient()

  const { isPending: isDeleting, mutate: deleteConversation } = useMutation({
    mutationFn: chatApi.deleteConversation,
    onSuccess: () => {
      toast.success('Conversation successfully deleted')

      queryClient.invalidateQueries({
        queryKey: ['conversations']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isDeleting, deleteConversation }
}
