import { useContext } from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileFooter from './MobileFooter'
import { AppContext } from 'src/contexts/app.context'

function Sidebar({ children }: { children: React.ReactNode }) {
  // const currentUser = await getCurrentUser()
  const { profile } = useContext(AppContext)

  return (
    <div className='h-full'>
      <DesktopSidebar currentUser={profile!} />
      <MobileFooter />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  )
}

export default Sidebar
