import path from 'src/constants/path'
import NavLinkUnderlineTabs from 'src/components/NavLinkUnderlineTabs'
import { Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'

const statusTabs = [
  { url: path.adminProductAll, label: 'all' },
  { url: path.adminProductPendingApproval, label: 'pending approval' },
  { url: path.adminProductForSale, label: 'for sale' },
  { url: path.adminProductTemporarilyLocked, label: 'temporarily locked' },
  { url: path.adminProductDeleted, label: 'deleted by super shop' }
]

export default function ProductApproval() {
  const { selectedTab } = useContext(ProductTabsProcessContext)

  return (
    <div className='w-full'>
      <div className='sticky z-10 top-14 h-14 flex flex-row rounded-md bg-white items-center shadow mb-4'>
        <NavLinkUnderlineTabs selectedTab={selectedTab} tabs={statusTabs} />
      </div>
      <div className='w-full bg-white rounded-xl px-6 pt-2 pb-6 shadow-sm'>
        <Outlet />
      </div>
    </div>
  )
}
