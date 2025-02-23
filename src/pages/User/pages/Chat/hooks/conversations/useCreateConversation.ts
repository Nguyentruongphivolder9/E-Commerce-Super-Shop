import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'

export function useCreateConversation() {
  const queryClient = useQueryClient()

  const { isPending: isCreating, mutate: createConversation } = useMutation({
    mutationFn: chatApi.createConversation,
    onSuccess: () => {
      toast.success('Conversation created successfully')
      queryClient.invalidateQueries({
        queryKey: ['conversations']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isCreating, createConversation }
}
