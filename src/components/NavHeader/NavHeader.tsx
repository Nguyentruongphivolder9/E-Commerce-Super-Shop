import { Link } from 'react-router-dom'
import Popover from '../Popover'
import path from 'src/constants/path'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { getAvatarUrl } from 'src/utils/utils'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

type FormDataLogout = {
  email: string
}

export default function NavHeader() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)
  const queryClient = useQueryClient()
  const { i18n } = useTranslation()
  const { t } = useTranslation('header')

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
          onError: (e) => {
            toast.error('Đăng xuất thất bại, vui lòng thử lại sau.')
          }
        }
      )
    }
  }

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className='flex justify-between ml-auto container'>
      <div className='flex items-center gap-3'>
        <Link
          to={'/shopchannel'}
          className='flex text-sm text-[#fff] cursor-pointer items-center h-fit px-[10px] py-[7px] hover:text-white/70'
        >
          Seller Centre
        </Link>
      </div>
      <div className='flex space-x-4'>
        <Popover
          className='flex cursor-pointer items-center h-fit px-[10px] py-[7px] hover:text-white/70'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col'>
                <button
                  onClick={() => handleLanguageChange('vi')}
                  className='text-sm py-2 pl-6 pr-32 text-left hover:text-orange'
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className='text-sm mt-2 py-2 pl-6 pr-32 text-left hover:text-orange'
                >
                  English
                </button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='text-sm mx-1'>{i18n.language === 'en' ? 'English' : 'Tiếng Việt'}</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
          </svg>
        </Popover>
        {isAuthenticated && (
          <Popover
            className='flex items-center py-[5px] hover:text-gray-300 cursor-pointer'
            renderPopover={
              <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                <Link
                  to={path.profile}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  My Account
                </Link>
                <Link
                  to={path.historyPurchase}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  Order
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                >
                  {t('header.logout')}
                </button>
              </div>
            }
          >
            <div className='relative flex items-center space-x-2'>
              <div className='relative'>
                <img
                  src={profile?.avatarUrl || getAvatarUrl(profile?.email)}
                  alt='avatar'
                  className='w-7 h-7 rounded-full object-cover border-2 border-gray-300'
                />
                <span className='absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full ring-2 ring-white dark:ring-gray-500'></span>
              </div>
              <div className='flex flex-col ml-3'>
                <span className='text-sm font-medium'>{profile?.userName}</span>
              </div>
            </div>
          </Popover>
        )}
        {!isAuthenticated && (
          <div className='flex items-center'>
            <Link to={path.register} className='mx-3 text-sm capitalize hover:text-white/70'>
              {t('header.signOut')}
            </Link>
            <Link to={path.login} className='mx-3 text-sm capitalize hover:text-white/70'>
              {t('header.signIn')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
