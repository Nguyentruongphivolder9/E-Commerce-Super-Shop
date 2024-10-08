import clsx from 'clsx'

import { format } from 'date-fns'
import { useContext, useState } from 'react'

import ImageModal from './ImageModal'
import { FullMessageType, MessageResponse } from 'src/types/chat.type'
import { AppContext } from 'src/contexts/app.context'
import Avatar from '../../components/Avatar'
import { useUserById } from '../../hooks/users/useUserById'

interface MessageBoxProps {
  data: MessageResponse
  isLast?: boolean
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }: MessageBoxProps) => {
  const { profile } = useContext(AppContext)
  const { user: sender } = useUserById(data.senderId)
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const isOwn = profile?.email === sender?.email
  // const seenList = (data.seen || [])
  //   .filter((user) => user.email !== data?.sender?.email)
  //   .map((user) => user.userName)
  //   .join(', ')

  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end')

  const avatar = clsx(isOwn && 'order-2')

  const body = clsx('flex flex-col gap-2', isOwn && 'items-end')

  const message = clsx(
    'text-sm w-fit overflow-hidden',
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
  )

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={sender} />
      </div>
      <div className={body}>
        <div className='flex items-center gap-1'>
          <div className='text-sm text-gray-500'>{sender.userName}</div>
          <div className='text-xs text-gray-400'>{format(new Date(data?.createdAt ?? ''), 'p')}</div>
        </div>

        <div className={message}>
          <ImageModal src={data.image} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
          {data.image ? (
            <img
              src={data.image}
              alt=''
              className='
                object-cover
                cursor-pointer
                hover:scale-110
                transition
                translate
              '
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>

        {/* {isLast && isOwn && seenList.length > 0 && (
          <div className='text-xs font-light text-gray-500'>{`Seen by ${seenList}`}</div>
        )} */}
      </div>
    </div>
  )
}

export default MessageBox
