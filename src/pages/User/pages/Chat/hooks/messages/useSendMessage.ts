import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import chatApi from 'src/apis/chat.api'

export function useSendMessage() {
  const queryClient = useQueryClient()
  const { isPending: isSending, mutate: sendMessage } = useMutation({
    mutationFn: chatApi.sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['messages']
      })
    },
    onError: (err) => toast.error(err.message)
  })
  return {
    isSending,
    sendMessage
  }
}
