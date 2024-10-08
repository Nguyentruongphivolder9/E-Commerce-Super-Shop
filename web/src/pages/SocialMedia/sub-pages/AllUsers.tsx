import { useToast } from 'src/components/ui/use-toast'
import { Loader, UserCard } from 'src/components/shared'
import { useUsers } from 'src/pages/Chat/hooks/users/useUsers'

const AllUsers = () => {
  const { toast } = useToast()

  const { users: creators, isLoading, isError: isErrorCreators } = useUsers()

  if (isErrorCreators) {
    toast({ title: 'Something went wrong.' })

    return
  }

  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className='user-grid'>
            {creators?.map((creator) => (
              <li key={creator?.id} className='flex-1 min-w-[200px] w-full  '>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AllUsers
