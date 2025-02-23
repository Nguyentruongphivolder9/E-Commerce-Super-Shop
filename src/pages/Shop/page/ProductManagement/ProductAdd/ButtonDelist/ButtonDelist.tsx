import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface Props {
  onSubmitDelist: () => void
  handleSubmitSaveProduct: (open: () => void) => void
}

export default function ButtonDelist({ onSubmitDelist, handleSubmitSaveProduct }: Props) {
  const [opened, { close, open }] = useDisclosure(false)
  return (
    <div className='h-auto w-auto'>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div className='w-[400px] relative bg-white h-auto'>
          <div className='flex flex-col'>
            <div className='px-6 pt-4 pb-6 text-[#333333] flex justify-start items-center'>
              <span className='text-xl'>Are you sure to Save and Delist ?</span>
            </div>
            <div className='px-6 text-[#333333] text-sm flex flex-col'>
              Improve the quality of this listing for better performance. Optimise now before publishing!
            </div>
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
                  onSubmitDelist()
                  close()
                }}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                Save and Delist
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button
        className='text-[#999999] bg-white text-sm h-8 w-36 flex items-center justify-center  rounded-md border border-solid border-[#999999]'
        type='button'
        onClick={() => handleSubmitSaveProduct(open)}
      >
        Save and Delist
      </button>
    </div>
  )
}
