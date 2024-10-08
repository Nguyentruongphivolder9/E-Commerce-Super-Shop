import { useContext } from 'react'
import path from 'src/constants/path'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import ProductManagementStatus from '../components/ProductManagementStatus'
import statusProduct from 'src/constants/status'

export default function ProductPendingApproval() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('pending approval')
  return (
    <ProductManagementStatus
      path={path.adminProductPendingApproval}
      queryKey='getAllProductWithStatusPendingApprovalForAdmin'
      status={statusProduct.PENDING_APPROVAL}
    />
  )
}
