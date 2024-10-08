import { Link } from 'react-router-dom'

export default function HeaderAdmin() {
  return (
    <div className='h-14 fixed w-full bg-white z-10'>
      <div className='h-full flex flex-row justify-end items-center shadow-[0_1px_4px_0_rgba(74,74,78,.12)]'>
        <div className='flex flex-row gap-1 items-center h-full'>
          <div className='flex flex-row gap-1 items-center h-full'>
            <div className='flex justify-center items-center w-12 h-full hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z'
                />
              </svg>
            </div>

            <div className='flex justify-center items-center w-12 h-full hover:bg-slate-100'>
              <div className='relative w-10 h-10 flex justify-center items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0'
                  />
                </svg>
                <div className='text-center absolute top-1 right-1 text-xs rounded-full bg-[#0099FF] whitespace-nowrap text-white px-[3px] font-medium'>
                  12
                </div>
              </div>
            </div>
          </div>
          <div className='bg-[#e5e5e5] w-[1px] h-[18px] mx-2'></div>
          <div className='flex flex-row gap-1 items-center px-4 py-1 h-full'>
            <div className='w-8 h-8 mr-2 flex-shrink-0'>
              <img
                src='https://cf.shopee.vn/file/5e43c09b3e295847ff5d41456d032beb'
                alt='avatar'
                className='w-full h-full object-cover rounded-full'
              />
            </div>
            <div className='flex flex-row gap-1 items-center'>
              <span className='text-sm'>ngocnhi25</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
