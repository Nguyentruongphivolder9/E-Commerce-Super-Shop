import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import path from 'src/constants/path'

const menuItems = [
  {
    label: 'Order',
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
          d='M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184'
        />
      </svg>
    ),
    subItems: [
      { label: 'My Order', path: path.orderShop },
      // { label: 'Cancellation', path: '#' },
      { label: 'Return/Refund', path: path.returnOrderShop }
      // { label: 'Shipping Settings', path: '#' }
    ]
  },
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
          d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
        />
      </svg>
    ),
    subItems: [
      { label: 'My Products', path: path.productManagementAll },
      { label: 'Add New Product', path: path.productAdd },
      { label: 'My Shop Categories', path: path.myShopCategories }
    ]
  },
  {
    label: 'Marketing Centre',
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
          d='M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z'
        />
        <path strokeLinecap='round' strokeLinejoin='round' d='M6 6h.008v.008H6V6Z' />
      </svg>
    ),
    subItems: [
      { label: 'Super Shop Ads', path: '/shopchannel/portal/advertise' },
      { label: 'Vouchers', path: path.voucherShop }
    ]
  }
]

const initialVisibility = menuItems.reduce((acc: any, _, index) => {
  acc[index] = true
  return acc
}, {})

export default function NavShop() {
  const [visibleLists, setVisibleLists] = useState<any>(initialVisibility)

  const toggleVisibility = (index: number) => {
    setVisibleLists((prevState: any) => ({
      ...prevState,
      [index]: !prevState[index]
    }))
  }
  return (
    <div className='h-full bg-white fixed z-10 mt-14 sidebar-height overflow-y-auto no-scrollbar hover:scrollbar-webkit hover:scrollbar-thin'>
      <div className='h-auto w-[222px] bg-white pt-4 px-4'>
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
  )
}
