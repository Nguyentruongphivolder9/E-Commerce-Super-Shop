import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constants/path'
import logoBlue from 'src/assets/images/logo_blue.png'

const menuItems = [
  {
    label: 'Product',
    iconSVG: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-4'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z'
        />
      </svg>
    ),
    subItems: [
      { label: 'Product Approval', path: path.adminProductAll },
      { label: 'Categories', path: path.adminCategories },
      { label: 'Keyword & Violation', path: path.adminTypeOfViolation }
    ]
  },
  {
    label: 'Advertise',
    iconSVG: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='currentColor'
        className='size-4'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z'
        />
      </svg>
    ),
    subItems: [{ label: 'Advertise Management', path: '/admin-super-shop/advertise' }]
  }
]

const initialVisibility = menuItems.reduce((acc: any, _, index) => {
  acc[index] = true
  return acc
}, {})

export default function NavAdmin() {
  const [visibleLists, setVisibleLists] = useState<any>(initialVisibility)

  const toggleVisibility = (index: number) => {
    setVisibleLists((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index]
    }))
  }

  return (
    <div className='fixed z-20 bg-white h-full'>
      <div className='flex items-center justify-center left-0 h-14'>
        <Link to={path.adminSuperShop} className='w-28 flex justify-end'>
          <img src={logoBlue} alt='Facebook' className='h-12' />
        </Link>
      </div>
      <div className='overflow-y-auto no-scrollbar hover:scrollbar-webkit hover:scrollbar-thin'>
        <div className='h-auto w-[222px] pt-4 px-4'>
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className='mb-2'>
                <button
                  type='button'
                  onClick={() => toggleVisibility(index)}
                  className='flex w-full flex-row justify-between items-center text-[#999999] py-[5px]'
                >
                  <div className='flex flex-row justify-between gap-1'>
                    {item.iconSVG}

                    <div className='text-sm font-semibold'>{item.label}</div>
                  </div>
                  <div className={`transition-transform duration-300 ${visibleLists[index] ? 'rotate-180' : ''}`}>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                    </svg>
                  </div>
                </button>
                <ul
                  className={`pl-6 overflow-hidden transition-all duration-300 ease-in-out ${visibleLists[index] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className='py-[5px] text-[13px] hover:text-[#0099FF]'>
                      <NavLink
                        to={subItem.path}
                        className={({ isActive }) => (isActive ? 'text-[#0099FF]' : 'text-[#333333]')}
                      >
                        {subItem.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
