import ProductManagementStatus from '../components/ProductManagementStatus'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import statusProduct from 'src/constants/status'
import path from 'src/constants/path'
import { useContext } from 'react'

export default function ProductDeleted() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('deleted by super shop')
  return (
    <ProductManagementStatus
      path={path.adminProductDeleted}
      queryKey='getAllProductWithStatusDeletedForAdmin'
      status={statusProduct.DELETE}
    />
  )
}
