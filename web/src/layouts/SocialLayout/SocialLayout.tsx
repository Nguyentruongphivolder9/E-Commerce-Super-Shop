import { Outlet } from 'react-router-dom'

import Topbar from 'src/components/shared/Topbar'
import Bottombar from 'src/components/shared/Bottombar'
import LeftSidebar from 'src/components/shared/LeftSidebar'

// import './global.css'

const SocialLayout = () => {
  return (
    <main className='h-screen'>
      <div className='box-border list-none p-0 m-0 scroll-smooth'>
        <div className='bg-dark-1 text-white min-h-screen font-inter'>
          <div className='w-full md:flex'>
            <Topbar />
            <LeftSidebar />

            <section className='flex flex-1 h-full container'>
              <Outlet />
            </section>

            <Bottombar />
          </div>
        </div>
      </div>
    </main>
  )
}

export default SocialLayout
