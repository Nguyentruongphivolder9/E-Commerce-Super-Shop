import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'

export function useCreatePrivateConversation() {
  const queryClient = useQueryClient()

  const { isPending: isCreating, mutate: createConversation } = useMutation({
    mutationFn: chatApi.createPrivateConversation,
    onSuccess: () => {
      toast.success('Conversation private created successfully')
      queryClient.invalidateQueries({
        queryKey: ['conversations']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isCreating, createConversation }
}
