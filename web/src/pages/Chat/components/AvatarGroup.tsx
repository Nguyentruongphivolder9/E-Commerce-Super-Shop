import { User } from 'src/types/user.type'
import { getAvatarUrl } from 'src/utils/utils'

interface AvatarGroupProps {
  users?: User[]
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }: AvatarGroupProps) => {
  const slicedUsers = users.slice(0, 3)

  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div className='relative h-11 w-11'>
      {slicedUsers.map((user, index) => (
        <div
          key={user.email}
          className={`
                absolute
                inline-block
                rounded-full
                overflow-hidden
                h-[21px]
                w-[21px]
                ${positionMap[index as keyof typeof positionMap]}`}
        >
          <img alt='Avatar' src={user?.avatarUrl || getAvatarUrl(user?.email)} />
        </div>
      ))}
    </div>
  )
}

export default AvatarGroup
