import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface Props {
  onSubmitToList: (c: string) => void
  typeButton: string
  itemRedundantCount: number
  itemHandlerCount: number
}

export default function ButtonPublishToList({
  onSubmitToList,
  typeButton,
  itemRedundantCount,
  itemHandlerCount
}: Props) {
  const [opened, { close, open }] = useDisclosure(false)
  return (
    <div className='h-auto w-auto'>
      <Modal
        withCloseButton={false}
        opened={opened}
        onClose={close}
        centered
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div className='w-[400px] relative bg-white h-auto'>
          <div className='flex flex-col'>
            <div className='px-6 pb-6 pt-4 text-[#333333] flex justify-start items-center'>
              <span className='text-xl'>Are you sure to Save and {typeButton} ?</span>
            </div>
            {typeButton == 'publish' ? (
              <div className='px-6 text-[#333333] text-sm flex flex-col'>
                {itemHandlerCount} out of {itemRedundantCount} products are already live. Click confirm to continue
                publishing the remaining {itemHandlerCount} products.
              </div>
            ) : (
              <div className='px-6 text-[#333333] text-sm flex flex-col'>
                You have selected {itemRedundantCount} products and {itemHandlerCount} is already delisted. Click
                ‘confirm’ to continue delist the other {itemHandlerCount} products
              </div>
            )}

            <div className='p-6 flex flex-row justify-end gap-2'>
              <button
                type='button'
                onClick={close}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 text-[#333333]`}
              >
                Optimize Now
              </button>
              <button
                type='button'
                onClick={() => {
                  onSubmitToList(typeButton)
                  close()
                }}
                className={`text-sm capitalize border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                {typeButton} to {itemHandlerCount} item
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button
        className='text-[#333333] bg-white text-sm px-5 py-[6px] flex items-center justify-center  rounded-md border border-solid border-[#999999]'
        type='button'
        onClick={open}
      >
        {typeButton}
      </button>
    </div>
  )
}
