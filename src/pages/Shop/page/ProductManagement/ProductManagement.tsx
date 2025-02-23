import { Link, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import NavLinkUnderlineTabs from '../../../../components/NavLinkUnderlineTabs'
import { useContext } from 'react'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'

const statusTabs = [
  { url: path.productManagementAll, label: 'all' },
  { url: path.productManagementForSale, label: 'for sale' },
  { url: path.productViolationBanned, label: 'violation' },
  { url: path.productReviewing, label: 'under super shop review' },
  { url: path.productUnlisted, label: 'unpublished' }
]

export default function ProductManagement() {
  const { selectedTab } = useContext(ProductTabsProcessContext)

  return (
    <div className='w-full'>
      <div className='h-10 w-full mb-2 flex flex-row justify-between items-center'>
        <div className='text-xl'>Product</div>
        <Link
          to={path.productAdd}
          className='bg-blue h-full flex items-center justify-center rounded-md px-4 text-white'
        >
          Add a new product
        </Link>
      </div>
      <div className='flex flex-row items-center h-14'>
        <NavLinkUnderlineTabs selectedTab={selectedTab} tabs={statusTabs} />
      </div>
      <div className='w-full bg-white rounded-xl px-6 pt-2 pb-6 shadow-sm'>
        <Outlet />
      </div>
    </div>
  )
}
