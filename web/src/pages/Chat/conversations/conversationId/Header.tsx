import { useMemo, useState } from 'react'

import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'

import ProfileDrawer from './ProfileDrawer'
import { ConversationResponse } from 'src/types/chat.type'
import useOtherUser from '../../hooks/users/useOtherUser'
import LoadingModal from '../../components/LoadingModal'
import { Link } from 'react-router-dom'
import AvatarGroup from '../../components/AvatarGroup'
import Avatar from '../../components/Avatar'
import { useUsersByAccountIds } from '../../hooks/users/useUserById'

interface HeaderProps {
  conversation: ConversationResponse
}

const Header: React.FC<HeaderProps> = ({ conversation }: HeaderProps) => {
  const { isLoading, otherUser } = useOtherUser(conversation)
  const { isLoading: isLoadingUsers, users } = useUsersByAccountIds(conversation.accountIds)
  const [drawerOpen, setDrawerOpen] = useState(false)

  //Active Users
  // const { members } = useActiveList()
  // const isActive = members.indexOf(otherUser?.email!) !== -1

  const statusText = useMemo(() => {
    if (conversation.group) {
      return `${users.length} members`
    }

    return otherUser ? 'Active' : 'Offline'
  }, [conversation.group, users, otherUser])

  if (isLoading || isLoadingUsers) return <LoadingModal />

  return (
    <>
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div
        className='
        bg-white
          w-full
          flex
          border-b-[1px]
          sm:px-4
          py-3
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-sm'
      >
        <div className='flex gap-3 items-center'>
          <Link
            className='lg:hidden block text-sky-500 hover:text-sky-600 transition cursor-pointer'
            to='/conversations'
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.group ? <AvatarGroup users={users} /> : <Avatar user={otherUser} />}
          <div className='flex flex-col'>
            <div>{conversation.name || otherUser?.userName}</div>
            <div className='text-sm font-light text-neutral-500'>{statusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='text-sky-500 cursor-pointer hover:text-sky-600 transition'
        />
      </div>
    </>
  )
}

export default Header
