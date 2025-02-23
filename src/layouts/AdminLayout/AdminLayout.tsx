import { Outlet } from 'react-router-dom'
import HeaderAdmin from 'src/pages/Admin/components/HeaderAdmin'
import NavAdmin from 'src/pages/Admin/components/NavAdmin'

export default function AdminLayout() {
  return (
    <div>
      <HeaderAdmin />
      <NavAdmin />
      <div className='relative pr-4 pb-4 pt-[72px] pl-[238px] w-full h-full bg-[#f6f6f6]'>
        <Outlet />
      </div>
    </div>
  )
}
