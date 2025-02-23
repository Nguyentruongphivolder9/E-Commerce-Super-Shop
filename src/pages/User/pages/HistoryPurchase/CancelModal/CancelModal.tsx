import { Button, Modal } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Flip, toast } from 'react-toastify'
import { orderApi } from 'src/apis/order.api'
import { OrderResponse } from 'src/types/order.type'

interface CancelModalProps {
  order: OrderResponse
  opened: boolean
  open: () => void
  close: () => void
}

export default function CancelModal({ order, opened, open, close }: CancelModalProps) {
  const queryClient = useQueryClient()
  const canCelMutation = useMutation({
    mutationFn: orderApi.cancelOrder
  })

  const handleSubmit = async () => {
    if (order) {
      const response = await canCelMutation.mutateAsync(order.id as string)
      if (response.data.statusCode === 200) {
        close()
        toast.success('Cancel Sucessfully', {
          position: 'top-center',
          autoClose: 1500,
          transition: Flip
        })
        queryClient.invalidateQueries({ queryKey: ['OrdersByAccountId'] })
      }
    }
  }

  return (
    <Modal
      size={800}
      withCloseButton={false}
      opened={opened}
      onClose={() => {
        close()
      }}
      centered
    >
      <div className=''>
        <div className='container mx-auto p-4'>
          <h2 className='text-2xl mb-4'>Cancel Order</h2>
          <div className='flex items-center'>Do you want to cancel order</div>
        </div>

        <div className='flex bg-white sticky bottom-0 py-4 justify-end items-center gap-4 '>
          <Button
            onClick={() => {
              close()
            }}
            className='bg-transparent text-[#666666] hover:bg-slate-200 hover:text-[#666666]'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit()
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
