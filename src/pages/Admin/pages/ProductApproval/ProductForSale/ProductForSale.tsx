import { useContext } from 'react'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import ProductManagementStatus from '../components/ProductManagementStatus'
import path from 'src/constants/path'
import statusProduct from 'src/constants/status'

export default function ProductForSale() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('for sale')
  return (
    <ProductManagementStatus
      path={path.adminProductForSale}
      queryKey='getAllProductWithStatusForSaleForAdmin'
      status={statusProduct.FOR_SALE}
    />
  )
}
