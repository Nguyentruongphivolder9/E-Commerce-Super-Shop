import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from 'react-router-dom'
import path from 'src/constants/path'

export default function ButtonCancel() {
  const [opened, { close, open }] = useDisclosure(false)
  const navigate = useNavigate()
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
              <span className='text-xl'>Confirm</span>
            </div>
            <div className='px-6 text-[#333333] text-sm flex flex-col'>Discard changes?</div>
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
                onClick={() => {
                  navigate(path.productManagementAll)
                  close()
                }}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                Discard
              </button>
            </div>
          </div>
          <button onClick={close} type='button' className='text-[#999999] h-6 p-1 absolute right-4 top-0 w-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </Modal>

      <Button
        onClick={open}
        className='hover:bg-gray-100 hover:text-[#999999] text-[#999999] font-medium bg-white text-sm h-8 w-36 flex items-center justify-center  rounded-md border border-solid border-[#999999]'
      >
        Cancel
      </Button>
    </div>
  )
}
