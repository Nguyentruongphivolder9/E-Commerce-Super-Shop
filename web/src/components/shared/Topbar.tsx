import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../ui/button'

import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'

type FormDataLogout = {
  email: string
}

const Topbar = () => {
  const { setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const logoutMutation = useMutation({
    mutationFn: (body: FormDataLogout) => authApi.logout(body)
  })

  const handleLogout = () => {
    const token = localStorage.getItem('accessToken') || ''
    const email = profile?.email || ''
    if (token && email) {
      logoutMutation.mutate(
        { email },
        {
          onSuccess: () => {
            setIsAuthenticated(false)
            setProfile(null)
            queryClient.clear()
            localStorage.removeItem('secretkey')
            localStorage.removeItem('accessToken')
          },
          onError: () => {
            toast.error('Logout failed')
          }
        }
      )
    }
  }

  return (
    <section className='topbar container'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src='/src/assets/images/logo_white.png' alt='logo' width={130} height={325} />
        </Link>

        <div className='flex gap-4'>
          <Button variant='ghost' className='shad-button_ghost' onClick={handleLogout}>
            <img src='/assets/icons/logout.svg' alt='logout' />
          </Button>
          <Link to={`/profile/${profile?._id}`} className='flex-center gap-3'>
            <img
              src={profile?.avatarUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-8 w-8 rounded-full'
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Topbar
