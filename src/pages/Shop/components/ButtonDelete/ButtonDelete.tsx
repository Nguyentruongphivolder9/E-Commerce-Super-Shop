import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface Props {
  handleConfirm: (close: () => void) => void
  className?: string
}

export default function ButtonDelete({
  handleConfirm,
  className = 'hover:bg-gray-100 hover:text-[#999999] text-[#999999] font-medium bg-white text-sm h-8 w-36 flex items-center justify-center  rounded-md border border-solid border-[#999999]'
}: Props) {
  const [opened, { close, open }] = useDisclosure(false)
  return (
    <div className='h-auto w-auto'>
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        centered
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div className='w-[400px] relative bg-white h-auto'>
          <div className='flex flex-col'>
            <div className='pb-6 px-6 text-[#333333] flex justify-start items-center'>
              <span className='text-xl'>Delete Product</span>
            </div>
            <div className='px-6 text-[#333333] text-sm flex flex-col'>
              Are you sure you want to delete the following product? If the product has a promotion, it will be removed
              from the promotion. Warning: You cannot undo this action!
            </div>
            <div className='pt-6 px-6 flex flex-row justify-end gap-2'>
              <button
                type='button'
                onClick={close}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 text-[#333333]`}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => handleConfirm(close)}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button onClick={open} className={className}>
        Delete
      </button>
    </div>
  )
}
