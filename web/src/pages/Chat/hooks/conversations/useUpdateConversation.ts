import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'
import { ConversationRequest } from 'src/types/chat.type'

export function useUpdateConversation() {
  const queryClient = useQueryClient()

  const { isPending: isUpdating, mutate: updateConversation } = useMutation({
    mutationFn: ({ conversationId, body }: { conversationId: string; body: ConversationRequest }) =>
      chatApi.updateConversation({ conversationId, body }),
    onSuccess: () => {
      toast.success('Conversation updated successfully')

      queryClient.invalidateQueries({
        queryKey: ['conversations']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isUpdating, updateConversation }
}
