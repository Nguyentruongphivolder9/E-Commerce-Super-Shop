import { useQuery } from '@tanstack/react-query'
import { createContext, useEffect, useState } from 'react'
import violationApi from 'src/apis/violation.api'
import config from 'src/constants/config'
import { ProductTypeViolation } from 'src/types/product.type'

interface ProductTabsProcessContextInterface {
  selectedTab: string
  setSelectedTab: (tab: string) => void
  typeOfViolations: ProductTypeViolation[] | null
  setTypeOfViolations: React.Dispatch<React.SetStateAction<ProductTypeViolation[] | null>>
}

const initialContext: ProductTabsProcessContextInterface = {
  selectedTab: 'all',
  setSelectedTab: () => null,
  typeOfViolations: null,
  setTypeOfViolations: () => null
}

export const ProductTabsProcessContext = createContext<ProductTabsProcessContextInterface>(initialContext)
export const ProductTabsProcessProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState(initialContext.selectedTab)
  const [typeOfViolations, setTypeOfViolations] = useState<ProductTypeViolation[] | null>(
    initialContext.typeOfViolations
  )

  const { data: listTypeOfViolationData } = useQuery({
    queryKey: [config.GET_LIST_TYPE_OF_VIOLATION_QUERY_KEY],
    queryFn: () => violationApi.getListTypeViolation()
  })

  useEffect(() => {
    setTypeOfViolations(listTypeOfViolationData?.data.body as ProductTypeViolation[])
  }, [listTypeOfViolationData])

  return (
    <ProductTabsProcessContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        typeOfViolations,
        setTypeOfViolations
      }}
    >
      {children}
    </ProductTabsProcessContext.Provider>
  )
}
