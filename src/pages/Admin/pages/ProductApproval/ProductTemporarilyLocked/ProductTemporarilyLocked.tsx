import statusProduct from 'src/constants/status'
import ProductManagementStatus from '../components/ProductManagementStatus'
import { useContext } from 'react'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import path from 'src/constants/path'

export default function ProductTemporarilyLocked() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('temporarily locked')
  return (
    <ProductManagementStatus
      path={path.adminProductTemporarilyLocked}
      queryKey='getAllProductWithStatusTemporarilyLockedForAdmin'
      status={statusProduct.TEMPORARILY_LOCKED}
    />
  )
}
