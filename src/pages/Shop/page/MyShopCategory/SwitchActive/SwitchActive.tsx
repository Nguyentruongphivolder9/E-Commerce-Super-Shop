import { Switch } from '@mantine/core'
import { useState } from 'react'

interface Props {
  isAction: boolean
  handleClickSwitch: () => void
  isDisplay: boolean
}

export default function SwitchActive({ isAction, handleClickSwitch, isDisplay }: Props) {
  const [checked, setChecked] = useState(isDisplay)
  return (
    <Switch
      checked={checked}
      onChange={(event) => {
        setChecked(event.currentTarget.checked)
        handleClickSwitch()
      }}
      color='teal'
      size='md'
      disabled={!isAction}
      className={isAction ? '' : 'cursor-not-allowed'}
      thumbIcon={
        checked ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4 text-[#2fdf35]'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4 text-[#fc3232]'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        )
      }
    />
  )
}
