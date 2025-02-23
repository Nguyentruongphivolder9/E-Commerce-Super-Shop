import { IconArrowNarrowRightDashed, IconChevronDown } from '@tabler/icons-react'

export default function HeaderChat() {
  return (
    <div className='h-[40px] w-full flex items-center justify-between px-3 border-b-[1px]'>
      <div className='flex gap-2 text-blue text-md'>
        <span className='font-semibold'>Chat</span>
      </div>
      <div className='flex gap-3'>
        <IconArrowNarrowRightDashed className='text-light-4' stroke={1.5} />
        <IconChevronDown className='text-light-4' stroke={1.5} />
      </div>
    </div>
  )
}
