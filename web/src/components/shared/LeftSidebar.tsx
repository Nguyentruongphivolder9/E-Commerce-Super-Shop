import { Link, NavLink, useLocation } from 'react-router-dom'

import { INavLink } from 'src/types/social.type'
import { sidebarLinks } from 'src/constants/socialLinks'

import { Button } from 'src/components/ui/button'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { useUserByEmail } from 'src/pages/Chat/hooks/users/useUserByEmail'

type FormDataLogout = {
  email: string
}

const LeftSidebar = () => {
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const logoutMutation = useMutation({
    mutationFn: (body: FormDataLogout) => authApi.logout(body)
  })
  const { setIsAuthenticated, profile: user, setProfile } = useContext(AppContext)
  const { user: currentUser } = useUserByEmail(user?.email)

  const handleLogout = () => {
    const token = localStorage.getItem('accessToken') || ''
    const email = user?.email || ''
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
          onError: (e: any) => {
            toast.error('Logout failed, please try again later.', e)
          }
        }
      )
    }
  }

  return (
    <nav className='leftsidebar container'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src='/src/assets/images/logo_white.png' alt='logo' width={170} height={36} />
        </Link>

        <Link to={`/social/profile/${currentUser._id}`} className='flex gap-3 items-center'>
          <img
            src={user?.avatarUrl || '/assets/icons/profile-placeholder.svg'}
            alt='profile'
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='body-bold'>{user?.userName}</p>
            <p className='small-regular text-light-3'>@{user?.userName}</p>
          </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route

            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button variant='ghost' className='shad-button_ghost' onClick={handleLogout}>
        <img src='/assets/icons/logout.svg' alt='logout' />
        <p className='small-medium lg:base-medium'>Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
