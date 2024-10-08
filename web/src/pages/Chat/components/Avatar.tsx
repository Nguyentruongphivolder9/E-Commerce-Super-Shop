import { User } from 'src/types/user.type'
import { getAvatarUrl } from 'src/utils/utils'

interface AvatarProps {
  user?: User
}

const Avatar: React.FC<AvatarProps> = ({ user }: AvatarProps) => {
  // const { members } = useActiveList()
  // const isActive = members.indexOf(user?.email!) !== -1

  return (
    <div className='relative'>
      <div
        className='
            relative
            inline-block
            rounded-full
            overflow-hidden
            h-9
            w-9
            md:h-11
            md:w-11
          '
      >
        <img alt='Avatar' src={user?.avatarUrl || getAvatarUrl(user?.email)} />
      </div>
      {true && (
        <span
          className='
              absolute
              block
              rounded-full
              bg-green-500
              ring-2
              ring-white
              top-0
              right-0
              h-2
              w-2
              md:h-3
              md:w-3
            '
        />
      )}
    </div>
  )
}

export default Avatar
