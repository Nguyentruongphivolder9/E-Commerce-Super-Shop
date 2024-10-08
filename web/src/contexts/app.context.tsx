import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLs } from 'src/utils/auth'
import categoryApi from 'src/apis/category.api'
import { useQuery } from '@tanstack/react-query'
import { CategoryResponse } from 'src/types/category.type'
import config from 'src/constants/config'
import ContainerModal from 'src/components/ContainerModal'
import { CartItemExtendedByShop, CartItemResponse } from 'src/types/cart.type'
import cartApi from 'src/apis/cart.api'
import { Pagination } from 'src/types/utils.type'
import { Order } from 'src/types/order.type'
import { Product } from 'src/types/product.type'
import productApi from 'src/apis/product.api'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  categories: CategoryResponse[] | null
  setCategories: React.Dispatch<React.SetStateAction<CategoryResponse[] | null>>
  reset: () => void
  setIsModal: React.Dispatch<React.SetStateAction<boolean>>
  setChildrenModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
  cartItems: Pagination<CartItemResponse[]> | null
  setCartItems: React.Dispatch<React.SetStateAction<Pagination<CartItemResponse[]> | null>>
  listProductInterest: Product[] | null
  setListProductInterest: React.Dispatch<React.SetStateAction<Product[] | null>>
  isLoadingCartItems: boolean
  isFetchingCartSuccess: boolean
  checkedCartItems: CartItemExtendedByShop[]
  setCheckedCartItems: Dispatch<SetStateAction<CartItemExtendedByShop[] | []>>
  orders: Order[] | null
  setOrders: Dispatch<SetStateAction<Order[] | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLs() as User,
  setProfile: () => null,
  categories: null,
  setCategories: () => null,
  reset: () => null,
  setChildrenModal: () => null,
  setIsModal: () => null,
  cartItems: null,
  setCartItems: () => null,
  isLoadingCartItems: true,
  isFetchingCartSuccess: false,
  orders: null,
  setOrders: () => null,
  checkedCartItems: [],
  setCheckedCartItems: () => null,
  listProductInterest: null,
  setListProductInterest: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)
  const [categories, setCategories] = useState<CategoryResponse[] | null>(initialAppContext.categories)
  const [isModal, setIsModal] = useState<boolean>(false)
  const [childrenModal, setChildrenModal] = useState<React.ReactNode | null>(null)
  const [cartItems, setCartItems] = useState<Pagination<CartItemResponse[]> | null>(initialAppContext.cartItems)
  const [orders, setOrders] = useState<Order[] | null>(initialAppContext.orders)
  const [checkedCartItems, setCheckedCartItems] = useState(initialAppContext.checkedCartItems)
  const [listProductInterest, setListProductInterest] = useState<Product[] | null>(
    initialAppContext.listProductInterest
  )

  // const [checkedCartItems, setCheckedCartItems] = useState<CartItemExtendedByShop[]>(initialAppContext.checkedCartItems)
  // const [listProductInterest, setListProductInterest] = useState<Product[] | null>(initialAppContext.listProductInterest)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  const { data: categoriesData } = useQuery({
    queryKey: [config.GET_CATEGORIES_QUERY_KEY],
    queryFn: () => categoryApi.getCategories(),
    enabled: isAuthenticated
  })

  const {
    data: listCartData,
    isLoading: isLoadingCartItems,
    isSuccess: isFetchingCartSuccess
  } = useQuery({
    queryKey: [config.GET_LIST_CART_QUERY_KEY],
    queryFn: () => cartApi.getListCart(),
    enabled: isAuthenticated
  })

  const { data: listProductInterestData } = useQuery({
    queryKey: [config.GET_LIST_PRODUCT_INTEREST_QUERY_KEY],
    queryFn: () => productApi.getListProductInterest(),
    enabled: isAuthenticated
  })

  useEffect(() => {
    setCategories((categoriesData?.data.body as CategoryResponse[]) || null)
    setCartItems((listCartData?.data.body as Pagination<CartItemResponse[]>) || null)
    setListProductInterest((listProductInterestData?.data.body as Product[]) || null)
  }, [categoriesData, listCartData, listProductInterestData])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        categories,
        setCategories,
        reset,
        setChildrenModal,
        setIsModal,
        cartItems,
        setCartItems,
        isLoadingCartItems,
        isFetchingCartSuccess,
        orders,
        setOrders,
        checkedCartItems,
        setCheckedCartItems,
        listProductInterest,
        setListProductInterest
      }}
    >
      {isModal && <ContainerModal>{childrenModal}</ContainerModal>}
      {children}
    </AppContext.Provider>
  )
}
