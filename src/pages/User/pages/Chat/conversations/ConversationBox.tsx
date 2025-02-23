import { useCallback, useContext, useMemo } from 'react'
import { format } from 'date-fns'
import clsx from 'clsx'
import { ConversationResponse, MessageResponse } from 'src/types/chat.type'
import { useNavigate } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import AvatarGroup from '../components/AvatarGroup'
import Avatar from '../components/Avatar'
import useOtherUser from '../hooks/users/useOtherUser'
import { useUsersByAccountIds } from '../hooks/users/useUserById'
import { useMessagesByConversationId } from '../hooks/messages/useMessagesByConversationId'
import { useMessageById } from '../hooks/messages/useMessageById'

interface ConversationBoxProps {
  data: ConversationResponse
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }: ConversationBoxProps) => {
  const { isLoading, otherUser } = useOtherUser(data)
  const { isLoading: isLoadingUser, users } = useUsersByAccountIds(data.accountIds)
  const { isLoading: isLoadingMessage, message: lastMessage } = useMessageById(
    data.messageIds[data.messageIds.length - 1]
  )

  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    navigate(`/chat/conversations/${data.id}`)
  }, [data.id, navigate])

  // const hasSeen = useMemo(() => {
  //   if (!lastMessage) {
  //     return false
  //   }

  //   const seenArray = lastMessage.seen || []

  //   if (!userEmail) {
  //     return false
  //   }

  //   return seenArray.filter((user) => user.email === userEmail).length !== 0
  // }, [userEmail, lastMessage])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image'
    }

    if (lastMessage?.body) {
      return lastMessage.body
    }

    return 'Started a conversation'
  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full,
        relative
        flex
        items-center
        space-x-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3
      `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.group ? <AvatarGroup users={users || []} /> : <Avatar user={otherUser} />}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <div
            className='
              flex
              justify-between
              items-center
              mb-1
            '
          >
            <p
              className='
                text-md
                font-medium
                text-gray-900
              '
            >
              {data.name || otherUser?.userName}
            </p>
            {lastMessage?.createdAt && (
              <p
                className='
                  text-xs
                  text-gray-400
                  font-light
                '
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
            `,
              // hasSeen ? 'text-gray-500' : 'text-black font-medium'
              selected ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox
