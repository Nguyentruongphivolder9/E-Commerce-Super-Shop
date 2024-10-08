import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'
import { MessageRequest } from 'src/types/chat.type'

export function useUpdateMessage() {
  const queryClient = useQueryClient()

  const { isPending: isUpdating, mutate: updateMessage } = useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: MessageRequest }) =>
      chatApi.updateMessage({ messageId, body }),
    onSuccess: () => {
      toast.success('Message updated')

      queryClient.invalidateQueries({
        queryKey: ['messages']
      })
    },
    onError: (err) => toast.error(err.message)
  })

  return { isUpdating, updateMessage }
}
