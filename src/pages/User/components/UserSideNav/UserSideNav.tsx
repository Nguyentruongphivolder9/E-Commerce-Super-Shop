import { Box, Button, Collapse, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classNames from 'classnames'
import { HtmlHTMLAttributes, ReactNode, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from 'src/utils/utils'
import { ReturnUserNavLink, UserSideNavLinks, userSideNavLinks } from './UserSideNavContext'
import { link } from 'fs'

export default function UserSideNav() {
  const { profile } = useContext(AppContext)
  const [openedNoti, handlersNoti] = useDisclosure(false)
  const [openAccountDetail, handlersAccountDetail] = useDisclosure(false);

  const handleUserNameShortCut = (userName : string):string => {
    for(let i = 0; i <= 0; i++){
      userName += userName.charAt(i)
      if(i = 12){
       userName + "...";
      }
    }
    return userName;
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow-md'>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-300'>
          <img src={profile?.avatarUrl || getAvatarUrl(profile?.email)} alt='' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-800'>{handleUserNameShortCut(profile!.userName)}</div>
          <Link
            to={path.profile}
            className='flex items-center capitalize text-gray-500 hover:text-gray-800 transition-colors'
          >
            <svg
              width={12}
              height={12}
              viewBox='0 0 12 12'
              xmlns='http://www.w3.org/2000/svg'
              style={{ marginRight: 4 }}
            >
              <path
                d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                fill='#9B9B9B'
                fillRule='evenodd'
              />
            </svg>
            Edit Profile
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <div>
          <button
            onClick={handlersAccountDetail.toggle}
            className={classNames(
              'flex items-center w-full mt-3 capitalize transition-colors py-2 px-2 rounded-md hover:bg-sky-100',
              {
                'text-sky-500 bg-sky-50': openAccountDetail,
                'text-gray-700': !openAccountDetail
              }
            )}
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <svg
                className="fill-blue w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="#000000"
                viewBox="0 0 256 256"
              >
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
              </svg>
            </div>
            My Account
          </button>
          <Box className='ml-4'>
            <Collapse in={openAccountDetail} transitionDuration={200} transitionTimingFunction='linear'>
              {userSideNavLinks.map((links: UserSideNavLinks) => (
                <ReturnUserNavLink title={links.title} linkTo={links.linkTo} key={links.linkTo}>
                  {links.children}
                </ReturnUserNavLink>
              ))}
            </Collapse>
          </Box>
        </div>


        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames('flex items-center mt-3 capitalize transition-colors py-2 px-2 rounded-md hover:bg-sky-100', {
              'text-sky-500 bg-sky-50': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg
              className='fill-blue w-5 h-5'
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              fill='#000000'
              viewBox='0 0 256 256'
            >
              <path d='M168,128a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,128Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16ZM216,40V200a32,32,0,0,1-32,32H72a32,32,0,0,1-32-32V40a8,8,0,0,1,8-8H72V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h24A8,8,0,0,1,216,40Zm-16,8H184v8a8,8,0,0,1-16,0V48H136v8a8,8,0,0,1-16,0V48H88v8a8,8,0,0,1-16,0V48H56V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16Z'></path>
            </svg>
          </div>
          My Purchase
        </NavLink>

        <div>
          <button
            onClick={handlersNoti.toggle}
            className={classNames(
              'flex items-center w-full mt-3 capitalize transition-colors py-2 px-2 rounded-md hover:bg-sky-100',
              {
                'text-sky-500 bg-sky-50': openedNoti,
                'text-gray-700': !openedNoti
              }
            )}
          >
            <div className='mr-3 h-[22px] w-[22px]'>
              <svg
                className='fill-blue w-5 h-5'
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                fill='#000000'
                viewBox='0 0 256 256'
              >
                <path d='M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z'></path>
              </svg>
            </div>
            Notifications
          </button>
          <Box className='ml-4'>
            <Collapse in={openedNoti} transitionDuration={200} transitionTimingFunction='linear'>
              <NavLink
                to={'/notifications/order'}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center mt-3 py-1 px-2 capitalize transition-colors rounded-md hover:bg-sky-100 text-sm font-normal',
                    {
                      'text-sky-500 bg-sky-50': isActive,
                      'text-gray-700': !isActive
                    }
                  )
                }
              >
                <div className='mr-1 h-[22px] w-[22px]'>
                  <svg
                    className='fill-blue w-5 h-5'
                    xmlns='http://www.w3.org/2000/svg'
                    width='32'
                    height='32'
                    fill='#000000'
                    viewBox='0 0 256 256'
                  >
                    <path d='M168,128a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,128Zm-8,24H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16ZM216,40V200a32,32,0,0,1-32,32H72a32,32,0,0,1-32-32V40a8,8,0,0,1,8-8H72V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h32V24a8,8,0,0,1,16,0v8h24A8,8,0,0,1,216,40Zm-16,8H184v8a8,8,0,0,1-16,0V48H136v8a8,8,0,0,1-16,0V48H88v8a8,8,0,0,1-16,0V48H56V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16Z'></path>
                  </svg>
                </div>
                <span className='flex-1'>Order updates</span>
              </NavLink>
            </Collapse>
          </Box>
        </div>
        <NavLink
          to={path.voucher}
          className={({ isActive }) =>
            classNames('flex items-center mt-3 capitalize transition-colors py-2 px-2 rounded-md hover:bg-sky-100', {
              'text-sky-500 bg-sky-50': isActive,
              'text-gray-700': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <svg className='fill-blue w-5 h-5' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
              <defs>
                <style dangerouslySetInnerHTML={{ __html: '.cls-1{fill:none;}' }} />
              </defs>
              <title />
              <g data-name='Layer 2' id='Layer_2'>
                <path d='M26,25H6a3,3,0,0,1-3-3V20a1,1,0,0,1,1-1,3,3,0,0,0,0-6,1,1,0,0,1-1-1V10A3,3,0,0,1,6,7H26a3,3,0,0,1,3,3v2a1,1,0,0,1-1,1,3,3,0,0,0,0,6,1,1,0,0,1,1,1v2A3,3,0,0,1,26,25ZM5,20.9V22a1,1,0,0,0,1,1H26a1,1,0,0,0,1-1V20.9a5,5,0,0,1,0-9.8V10a1,1,0,0,0-1-1H6a1,1,0,0,0-1,1v1.1a5,5,0,0,1,0,9.8Z' />
                <path d='M13,10a1,1,0,0,1-1-1V8a1,1,0,0,1,2,0V9A1,1,0,0,1,13,10Z' />
                <path d='M13,25a1,1,0,0,1-1-1V23a1,1,0,0,1,2,0v1A1,1,0,0,1,13,25Z' />
                <path d='M13,14a1,1,0,1,1,.71-.29A1.05,1.05,0,0,1,13,14Z' />
                <path d='M13,17a1,1,0,1,1,.71-.29,1,1,0,0,1-.33.21A1,1,0,0,1,13,17Z' />
                <path d='M13,20a1,1,0,1,1,.71-.29A1.05,1.05,0,0,1,13,20Z' />
              </g>
              <g id='frame'>
                <rect className='cls-1' height={32} width={32} />
              </g>
            </svg>
          </div>
          My Vouchers
        </NavLink>
      </div>
    </div>
  )
}

