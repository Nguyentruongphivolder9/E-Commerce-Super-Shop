import { useContext } from 'react'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import ProductManagementStatus from '../components/ProductManagementStatus'
import path from 'src/constants/path'

export default function ProductStatusAll() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('all')
  return <ProductManagementStatus path={path.adminProductAll} queryKey='getAllListProductForAdmin' />
}
