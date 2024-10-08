import axios from 'axios'

import { useCallback, useState } from 'react'
import Avatar from 'src/pages/Chat/components/Avatar'
import LoadingModal from 'src/pages/Chat/components/LoadingModal'
import { User } from 'src/types/user.type'

interface UserBoxProps {
  data: User
}

const UserBox: React.FC<UserBoxProps> = ({ data }: UserBoxProps) => {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(() => {
    setIsLoading(true)

    axios
      .post('api/conversations', {
        userId: data._id
      })
      .then((data) => {
        // router.push(`/conversations/${data.data.id}`)
      })
      .finally(() => setIsLoading(false))
  }, [data._id])

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className='
          w-full
          relative
          flex
          items-center
          space-x-3
          bg-white
          p-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
      '
      >
        <Avatar user={data} />
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
                    text-sm
                    font-medium
                text-gray-900'
              >
                {data.fullName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserBox