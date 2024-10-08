import { Link, useNavigate } from 'react-router-dom'

import { Button } from '../ui/button'
import { User } from 'src/types/user.type'
import { useCreatePrivateConversation } from 'src/pages/Chat/hooks/conversations/useCreatePrivateConversation'

type UserCardProps = {
  user: User
}

const UserCard = ({ user }: UserCardProps) => {
  const { isCreating, createConversation } = useCreatePrivateConversation()
  const navigate = useNavigate()

  const handleCreateConversation = async () => {
    try {
      await createConversation({
        name: user.userName,
        accountEmails: [user.email],
        isGroup: false,
        messageIds: []
      })

      // Navigate to the conversation page
      navigate(`/chat/conversations`)
    } catch (error) {
      console.error('Failed to create conversation:', error)
    }
  }

  return (
    <Link to={`/social/profile/${user.id}`} className='user-card'>
      <img
        src={user.avatarUrl || '/assets/icons/profile-placeholder.svg'}
        alt='creator'
        className='rounded-full w-14 h-14'
      />

      <div className='flex-center flex-col gap-1'>
        <p className='base-medium text-light-1 text-center line-clamp-1'>{user.userName}</p>
        <p className='small-regular text-light-3 text-center line-clamp-1'>@{user.userName}</p>
      </div>

      <Button
        type='button'
        size='sm'
        className='shad-button_primary px-5'
        onClick={handleCreateConversation}
        disabled={isCreating}
      >
        Chat Now
      </Button>
    </Link>
  )
}

export default UserCard
