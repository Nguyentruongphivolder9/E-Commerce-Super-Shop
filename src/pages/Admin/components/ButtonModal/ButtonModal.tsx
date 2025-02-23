import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRef } from 'react'

interface Props {
  title?: string
  children: React.ReactNode
  nameButton: string
  className?: string
  size?: number
  handleCancel?: () => void
  handleSubmit?: (close: () => void) => void
  isButtonSubmit?: boolean
  isShowButton?: boolean
}

export default function ButtonModal({
  children,
  title,
  nameButton,
  className = 'px-4 py-2 rounded-md text-sm font-normal bg-blue',
  size = 300,
  handleCancel = () => {},
  handleSubmit = () => {},
  isButtonSubmit = true,
  isShowButton = true
}: Props) {
  const [opened, { open, close }] = useDisclosure(false)
  const modalButtonRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Modal
        size={size}
        ref={modalButtonRef}
        opened={opened}
        onClose={() => {
          handleCancel()
          close()
        }}
        title={title}
        centered
      >
        {children}
        <div className='flex justify-end items-center gap-4 '>
          <Button
            onClick={() => {
              handleCancel()
              close()
            }}
            className='bg-transparent text-[#666666] hover:bg-slate-200 hover:text-[#666666]'
          >
            Cancel
          </Button>
          {isButtonSubmit && (
            <Button
              onClick={() => {
                handleSubmit(close)
              }}
            >
              Confirm
            </Button>
          )}
        </div>
      </Modal>

      <button
        className={className}
        onClick={() => {
          if (isShowButton) {
            open()
          }
        }}
      >
        {nameButton}
      </button>
    </>
  )
}
