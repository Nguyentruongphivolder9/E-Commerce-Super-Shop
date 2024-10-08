import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'

interface Props {
  title: string
  content: string
  icon: ReactNode
  linkURL: string
}

export default function VoucherBoxType({ title, content, icon, linkURL }: Props) {
  return (
    <div className='border border-gray-200'>
      <Link to={linkURL} className='block h-full'>
        <div className='flex flex-col h-full'>
          <div className='p-4 flex-1'>
            <div className='flex items-center text-gray-500'>
              {icon}
              <span className='text-base ml-2'>{title}</span>
            </div>
            <p className='text-sm text-gray-500'>{content}</p>
          </div>
          <div className='ml-auto mr-4 mb-4 mt-auto'>
            <Button className='bg-blue text-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px]'>
              Create
            </Button>
          </div>
        </div>
      </Link>
    </div>
  )
}
