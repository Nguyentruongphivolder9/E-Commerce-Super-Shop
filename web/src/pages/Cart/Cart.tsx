import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import QuantityController from 'src/components/QuantityController'
import path from 'src/constants/path'
import {
  formatCurrency,
  generateNameId,
  handleImageProduct,
  handlePriceProduct,
  handleStockQuantityProduct
} from 'src/utils/utils'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import debounce from 'lodash/debounce'
import { AppContext } from 'src/contexts/app.context'
import noProduct from 'src/assets/images/no-product.png'
import config from 'src/constants/config'
import VariationsPopover from './VariationsPopover'
import { ProductVariantsResponse } from 'src/types/product.type'
import SkeletonCartItemsLoader from './SkeletonCartItemsLoader'
import { CartItemExtendedByShop, CartItemResponse, CartItemResponseExtended } from 'src/types/cart.type'
import { Checkbox, Modal, Button } from '@mantine/core'
import cartApi from 'src/apis/cart.api'
import { useDisclosure } from '@mantine/hooks'
import DiscountDetailPopover from './DiscountDetailPopover'
import VoucherPopover from './VouchersPopover'
import voucherApi from 'src/apis/voucher.api'
import { OrderItem } from 'src/types/order.type'

export default function Cart() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [opened, handlers] = useDisclosure(false)
  const {
    profile,
    cartItems,
    setCartItems,
    isLoadingCartItems,
    isFetchingCartSuccess,
    setOrders,
    checkedCartItems: checkedCartItemsOnProvider,
    setCheckedCartItems
  } = useContext(AppContext)
  const [extendedCartItemsByShop, setExtendedCartItemsByShop] = useState<CartItemExtendedByShop[]>([])
  const [idByShops, setIdByShops] = useState<string[]>([])
  const [pickedVouchers, setPickedVouchers] = useState<
    { voucherId: string; shopId: string; voucherOffPrice: number }[]
  >([])
  const [pickVariantNames, setPickVariantNames] = useState<
    { shopId: string; productId: string; productVariantId: string; variantName: string }[]
  >([])
  const [totalOnShop, setTotalonShop] = useState<{ shopId: string; total: number }[]>([]) //include both either voucher or not
  // console.log('pickedVouchers', pickedVouchers)
  console.log('pickVariantNames', pickVariantNames)
  // console.log('totalOnShop', totalOnShop)

  useEffect(() => {
    const result = extendedCartItemsByShop.map((shop) => shop.shopInfo.id)
    setIdByShops(result)
  }, [extendedCartItemsByShop])

  const { data: vouchersByMultipleShop } = useQuery({
    queryKey: ['voucherMultipleByShop'],
    queryFn: async () => {
      //prettier-ignore
      const {data: {body}} = await voucherApi.getVouchersByMultipleShopId(idByShops)
      return body
    },
    enabled: idByShops.length > 0
  })

  const updateCartMutation = useMutation({
    mutationFn: cartApi.updateCart
  })

  const deleteCartItemsMutaion = useMutation({
    mutationFn: cartApi.deleteCartItems,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [config.GET_LIST_CART_QUERY_KEY] })
      handlers.close()
    }
  })

  const location = useLocation()
  const chosenCartItemIdFromLocation = (location.state as { productVariantId: string } | null)?.productVariantId
  const isAllChecked = useMemo(
    () => extendedCartItemsByShop?.every((cartItemByShop) => cartItemByShop.items.every((item) => item.checked)),
    [extendedCartItemsByShop]
  )
  const isAllOnShopChecked = useMemo(
    () => (shopIndex: number) => extendedCartItemsByShop[shopIndex]?.items.every((item) => item.checked),
    [extendedCartItemsByShop]
  )

  const checkedCartItems = useMemo(() => {
    return extendedCartItemsByShop
      .map((shop) => ({
        ...shop,
        items: shop.items.filter((item) => item.checked)
      }))
      .filter((shop) => shop.items.length > 0)
  }, [extendedCartItemsByShop])

  const quantityCheckedCartItems = useMemo(
    () => checkedCartItems.reduce((result, current) => result + current.items.length, 0),
    [checkedCartItems]
  )

  const totalFinalCheckedPurchasePrice = useMemo(
    () => totalOnShop.reduce((result, current) => result + current.total, 0), // either voucher or not
    [totalOnShop]
  )
  console.log('checkedCartItems', checkedCartItems)
  console.log('extendedCartItemsByShop', extendedCartItemsByShop)

  useEffect(() => {
    // đoạn này check trên provider có checkedItems thì cheked luôn
    const checkedCartItemsMapOnProvider = checkedCartItemsOnProvider
      ? keyBy(
          checkedCartItemsOnProvider.flatMap((cartItemsByShop) => cartItemsByShop.items),
          'productVariantId'
        )
      : {}

    setExtendedCartItemsByShop((prev) => {
      // Dùng flatMap cho nó dễ gán checked hơn
      const extendedCartObjectByVariant = keyBy(
        prev.flatMap((cartItemsByShop) => cartItemsByShop.items),
        'productVariantId'
      )

      console.log('extendedCartObjectByVariant', extendedCartObjectByVariant)

      const groupedbyShopArray = (cartItems?.content ?? []).reduce<CartItemExtendedByShop[]>(
        (accumulator, cartItem) => {
          const shopId = cartItem.shopInfo.id

          let group = accumulator.find((g) => g.shopInfo.id === shopId)

          if (!group || group == undefined) {
            group = { shopInfo: cartItem.shopInfo, items: [] }
            accumulator.push(group)
          }

          // Thêm thuộc tính disabled và checked
          const isChosenPurchaseIdFromLocation = chosenCartItemIdFromLocation === cartItem.productVariantId
          const extendedCartObject = {
            ...cartItem,
            disabled: false,
            checked:
              isChosenPurchaseIdFromLocation ||
              Boolean(extendedCartObjectByVariant[cartItem.productVariantId]?.checked) ||
              Boolean(checkedCartItemsMapOnProvider[cartItem.productVariantId]?.checked)
          }

          group.items.push(extendedCartObject)
          return accumulator
        },
        []
      )

      return groupedbyShopArray // output:: [{ shopInfo, items: [{ cartItem, disabled, checked }] }]
    })
  }, [cartItems?.content, checkedCartItemsOnProvider, chosenCartItemIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck =
    ({ shopIndex, cartItemIndex }: { shopIndex: number; cartItemIndex: number }) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedCartItemsByShop(
        produce((draft) => {
          draft[shopIndex].items[cartItemIndex].checked = e.target.checked
        })
      )
    }

  const handleCheckAll = () => {
    setExtendedCartItemsByShop((prev) =>
      prev.map((cartByShop) => ({
        ...cartByShop,
        items: cartByShop.items.map((cartItem) => ({
          ...cartItem,
          checked: !isAllChecked
        }))
      }))
    )
  }

  const handleCheckAllOnShop =
    ({ shopIndex }: { shopIndex: number }) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExtendedCartItemsByShop(
        produce((draft) => {
          draft[shopIndex].items.forEach((cartItem) => {
            cartItem.checked = e.target.checked
          })
        })
      )
    }

  const handleTypeQuantity = (shopIndex: number, cartItemIndex: number, value: number) => {
    setExtendedCartItemsByShop(
      produce((draft) => {
        draft[shopIndex].items[cartItemIndex].quantity = value
      })
    )
  }

  const debouncedHandleQuantity = useCallback(
    debounce(async (shopIndex: number, cartItemIndex: number, value: number, cartItem: CartItemResponseExtended) => {
      // tìm lại object cũ với quantity trước khi update(quantity cũ), xử lý call api ngu khi user nhập y sì quá trị cũ. Có thể dùng ref để lưu nhưng không biết làm đmcđ.
      const cartItemOnProvider = cartItems?.content.find((item) => item.productVariantId === cartItem?.productVariantId)
      const maxStockByProductVariant = handleStockQuantityProduct(cartItem.product, cartItem.productVariantId)
      const isSatisfyStockQuantity =
        value <= maxStockByProductVariant && value >= 1 && value !== cartItemOnProvider?.quantity
      if (!isSatisfyStockQuantity) return
      setExtendedCartItemsByShop(
        produce((draft) => {
          draft[shopIndex].items[cartItemIndex].disabled = true
        })
      )

      try {
        const response = await updateCartMutation.mutateAsync({
          productId: cartItem?.product.id,
          shopId: cartItem?.shopInfo.id,
          productVariantId: cartItem.productVariantId,
          quantity: value
        })
        if (response.data.statusCode === 200) {
          // đồng bộ cartItem trên provider, không bị Layout-shift
          setCartItems(
            produce((draft) => {
              if (draft !== null) {
                const itemIndex = draft.content.findIndex((item) => item.id === cartItem.id)
                if (itemIndex !== -1) {
                  draft.content[itemIndex] = response.data.body as CartItemResponse
                }
              }
            })
          )

          setExtendedCartItemsByShop(
            produce((draft) => {
              draft[shopIndex].items[cartItemIndex].disabled = false
            })
          )
        }
      } catch (error) {
        console.log(error)
      }
    }, 1000),
    [cartItems]
  )

  const handleQuantity = (
    shopIndex: number,
    cartItemIndex: number,
    value: number,
    cartItem: CartItemResponseExtended
  ) => {
    setExtendedCartItemsByShop(
      produce((draft) => {
        draft[shopIndex].items[cartItemIndex].quantity = value
      })
    )
    debouncedHandleQuantity(shopIndex, cartItemIndex, value, cartItem)
  }

  const handleDeleteCartItem =
    ({ shopIndex, cartItemIndex }: { shopIndex: number; cartItemIndex: number }) =>
    () => {
      const itemId = extendedCartItemsByShop[shopIndex]?.items[cartItemIndex]?.id
      deleteCartItemsMutaion.mutate([itemId])
    }

  const handleDeleteMultipleCartItem = () => {
    const listIdCartItem = checkedCartItems.flatMap((shop) =>
      shop.items.filter((item) => item.checked).map((item) => item.id)
    )
    deleteCartItemsMutaion.mutate(listIdCartItem)
  }

  const getOrderItemsWithVariantName = (items: CartItemResponseExtended[]): OrderItem[] => {
    return items.map((item) => {
      const variantName = pickVariantNames.find(
        (v) =>
          v.shopId === item.shopInfo.id &&
          v.productId === item.product.id &&
          v.productVariantId === item.productVariantId
      )?.variantName

      return {
        cartItemId: item.id,
        productId: item.product.id,
        productVariantId: item.productVariantId,
        imageUrl: handleImageProduct(item.product, item.productVariantId),
        productName: item.product.name,
        variantName: variantName || '',
        quantity: item.quantity,
        price: handlePriceProduct(item.product, item.productVariantId)
      }
    })
  }

  const handleSetOrdersToProvider = () => {
    setOrders(
      checkedCartItems
        .filter((shop) => shop.items.length > 0)
        .map((shop) => {
          const orderItems = getOrderItemsWithVariantName(shop.items)
          const voucherApplied = pickedVouchers.find((voucher) => voucher.shopId === shop.shopInfo.id)
          return {
            recipientName: profile?.userName || 'Default',
            recipientPhone: profile?.phoneNumber || 'Default',
            recipientAddress: profile?.address || 'Default',
            orderTotal: totalOnShop.find((shopEl) => shopEl.shopId === shop.shopInfo.id)?.total || 0,
            orderStatus: 'pending',
            paymentMethod: 'cod',
            shopId: shop.shopInfo.id,
            shopName: shop.shopInfo.userName,
            voucherId: voucherApplied?.voucherId as string,
            voucherOffPrice: voucherApplied?.voucherOffPrice as number,
            comment: '',
            orderItems: orderItems
          }
        })
    )
  }

  if (isLoadingCartItems) {
    return <SkeletonCartItemsLoader />
  }
  return (
    <div className='bg-neutral-100 py-5'>
      <div className='container'>
        {extendedCartItemsByShop && extendedCartItemsByShop.length > 0 && (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
                      </div>
                      <div className='flex-grow text-black'>Product</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Unit Price</div>
                      <div className='col-span-1'>Quantity</div>
                      <div className='col-span-1'>Total Price</div>
                      <div className='col-span-1'>Actions</div>
                    </div>
                  </div>
                </div>
                <div className='my-3 rounded-sm shadow'>
                  {/* item  is productvariant */}
                  {extendedCartItemsByShop.length > 0 &&
                    extendedCartItemsByShop.map((groupShop, indexShop) => (
                      <div className='bg-white mb-4' key={groupShop.shopInfo.id}>
                        <div className='flex items-center justify-start gap-x-3 px-9 py-6 border-b border-gray-200'>
                          <Checkbox
                            checked={isAllOnShopChecked(indexShop)}
                            onChange={handleCheckAllOnShop({ shopIndex: indexShop })}
                          />
                          <div className='inline-block bg-[#d0011b] leading-3 py-[2px] px-[3px] text-white rounded-sm'>
                            <svg className='w-6 h-[11px]' viewBox='0 0 24 11'>
                              <title>Mall</title>
                              <g className='fill-white' fillRule='evenodd'>
                                <path d='M19.615 7.143V1.805a.805.805 0 0 0-1.611 0v5.377H18c0 1.438.634 2.36 1.902 2.77V9.95c.09.032.19.05.293.05.444 0 .805-.334.805-.746a.748.748 0 0 0-.498-.69v-.002c-.59-.22-.885-.694-.885-1.42h-.002zm3 0V1.805a.805.805 0 0 0-1.611 0v5.377H21c0 1.438.634 2.36 1.902 2.77V9.95c.09.032.19.05.293.05.444 0 .805-.334.805-.746a.748.748 0 0 0-.498-.69v-.002c-.59-.22-.885-.694-.885-1.42h-.002zm-7.491-2.985c.01-.366.37-.726.813-.726.45 0 .814.37.814.742v5.058c0 .37-.364.73-.813.73-.395 0-.725-.278-.798-.598a3.166 3.166 0 0 1-1.964.68c-1.77 0-3.268-1.456-3.268-3.254 0-1.797 1.497-3.328 3.268-3.328a3.1 3.1 0 0 1 1.948.696zm-.146 2.594a1.8 1.8 0 1 0-3.6 0 1.8 1.8 0 1 0 3.6 0z' />
                                <path
                                  d='M.078 1.563A.733.733 0 0 1 .565.89c.423-.15.832.16 1.008.52.512 1.056 1.57 1.88 2.99 1.9s2.158-.85 2.71-1.882c.19-.356.626-.74 1.13-.537.342.138.477.4.472.65a.68.68 0 0 1 .004.08v7.63a.75.75 0 0 1-1.5 0V3.67c-.763.72-1.677 1.18-2.842 1.16a4.856 4.856 0 0 1-2.965-1.096V9.25a.75.75 0 0 1-1.5 0V1.648c0-.03.002-.057.005-.085z'
                                  fillRule='nonzero'
                                />
                              </g>
                            </svg>
                          </div>
                          <h2>{groupShop.shopInfo.fullName}</h2>
                          {/* chat icon */}
                          <svg className='w-6 h-6 fill-blue' viewBox='0 0 256 256'>
                            <path d='M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z'></path>
                          </svg>
                        </div>

                        <div>
                          {/* prettier-ignore */}
                          <div className={`${groupShop.items.length > 1 ? 'border border-gray-200 mx-5 rounded-sm my-5' : 'px-5'}`}>
                            {groupShop.items.length > 1 && <div className='h-12 bg-sky-100 rounded-t-sm'></div>}
                            {groupShop.items.map((item, indexCartItem) => (
                              <div key={item.id}>
                                <div className='mt-5 py-5 px-4 grid grid-cols-12 rounded-sm bg-white text-center text-sm text-gray-500'>
                                  <div className='col-span-6'>
                                    <div className='flex'>
                                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                        <Checkbox
                                          key={item.id}
                                          checked={item.checked}
                                          onChange={handleCheck({
                                            shopIndex: indexShop,
                                            cartItemIndex: indexCartItem
                                          })}
                                        />
                                      </div>
                                      <div className='flex-grow'>
                                        <div className='flex'>
                                          <Link
                                            className='h-20 w-20 flex-shrink-0'
                                            to={`${path.home + 'products/'}${generateNameId({ name: item.product.name, id: item.product.id, shopId: item.product.shopId })}`}
                                          >
                                            <img
                                              className='h-full w-full object-cover'
                                              alt={item.product.name}
                                              src={`${config.awsURL}products/${handleImageProduct(item.product, item.productVariantId)}`}
                                            />
                                          </Link>
                                          <div className='flex-1'>
                                            <div className='w-full flex flex-row h-full'>
                                              <div className='w-7/12 h-full pt-[5px] pl-[10px] pr-4'>
                                                <Link
                                                  to={`${path.home + 'products/'}${generateNameId({ name: item.product.name, id: item.product.id, shopId: item.product.shopId })}`}
                                                  className='line-clamp-2 text-[#000000DE] text-left'
                                                >
                                                  {item.product.name}
                                                </Link>
                                              </div>
                                              <div className='w-5/12 flex items-center justify-start h-full'>
                                                <VariationsPopover
                                                  id={item.id}
                                                  shopIndex={indexShop}
                                                  cartItemIndex={indexCartItem}
                                                  product={item.product}
                                                  productVariant={
                                                    item.product.productVariants.find(
                                                      (pv) => pv.id == item.productVariantId
                                                    ) as ProductVariantsResponse
                                                  }
                                                  setExtendedCartItemsByShop={setExtendedCartItemsByShop}
                                                  setPickVariantNames={setPickVariantNames}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-span-6 flex items-center'>
                                    <div className='grid grid-cols-5 items-center'>
                                      <div className='col-span-2'>
                                        <div className='flex items-center justify-center'>
                                          {/* <span className='text-gray-300 line-through'>
                                              ₫{formatCurrency(item.product.price_before_discount)}
                                              đ450000
                                            </span> */}
                                          <span className='ml-3 text-[#000000DE]'>
                                            ₫{formatCurrency(handlePriceProduct(item.product, item.productVariantId))}
                                          </span>
                                        </div>
                                      </div>
                                      <div className='col-span-1'>
                                        {/* prettier-ignore */}
                                        <QuantityController
                                            max={handleStockQuantityProduct(item.product, item.productVariantId)}
                                            value={item.quantity != 0 ? item.quantity : 1}
                                            onIncrease={(value) => handleQuantity(indexShop, indexCartItem, value, item)}
                                            onDecrease={(value) => handleQuantity(indexShop, indexCartItem, value, item)}
                                            onType={(value) => handleTypeQuantity(indexShop, indexCartItem, value)}
                                            onFocusOut={(value) => handleQuantity(indexShop, indexCartItem, value, item)}
                                            classNameWrapper='flex items-center'
                                            disabled={item.disabled}
                                        />
                                      </div>
                                      <div className='col-span-1'>
                                        <span className='text-blue'>
                                          ₫
                                          {formatCurrency(
                                            handlePriceProduct(item.product, item.productVariantId) * item.quantity
                                          )}
                                        </span>
                                      </div>
                                      <div className='col-span-1'>
                                        <button
                                          onClick={handleDeleteCartItem({
                                            shopIndex: indexShop,
                                            cartItemIndex: indexCartItem
                                          })}
                                          className='bg-none text-[#000000DE] transition-colors hover:text-blue'
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {indexCartItem < groupShop.items.length - 1 && (
                                  <div className='h-[1px] mr-5 ml-10 bg-gray-200'></div>
                                )}
                              </div>
                            ))}
                          </div>
                          <div className='px-9 py-4 flex items-center border-y border-gray-200 gap-x-2'>
                            <svg className='fill-blue w-5 h-5' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'>
                              <defs>
                                <style dangerouslySetInnerHTML={{ __html: '.cls-1{fill:none;}' }} />
                              </defs>
                              <title />
                              <g data-name='Layer 2' id='Layer_2'>
                                <path d='M26,25H6a3,3,0,0,1-3-3V20a1,1,0,0,1,1-1,3,3,0,0,0,0-6,1,1,0,0,1-1-1V10A3,3,0,0,1,6,7H26a3,3,0,0,1,3,3v2a1,1,0,0,1-1,1,3,3,0,0,0,0,6,1,1,0,0,1,1,1v2A3,3,0,0,1,26,25ZM5,20.9V22a1,1,0,0,0,1,1H26a1,1,0,0,0,1-1V20.9a5,5,0,0,1,0-9.8V10a1,1,0,0,0-1-1H6a1,1,0,0,0-1,1v1.1a5,5,0,0,1,0,9.8Z' />
                                <path d='M13,10a1,1,0,0,1-1-1V8a1,1,0,0,1,2,0V9A1,1,0,0,1,13,10Z' />
                                <path d='M13,25a1,1,0,0,1-1-1V23a1,1,0,0,1,2,0v1A1,1,0,0,1,13,25Z' />
                                <path d='M13,14a1,1,0,1,1,.71-.29A1.05,1.05,0,0,1,13,14Z' />
                                <path d='M13,17a1,1,0,1,1,.71-.29,1,1,0,0,1-.33.21A1,1,0,0,1,13,17Z' />
                                <path d='M13,20a1,1,0,1,1,.71-.29A1.05,1.05,0,0,1,13,20Z' />
                              </g>
                              <g id='frame'>
                                <rect className='cls-1' height={32} width={32} />
                              </g>
                            </svg>
                            <VoucherPopover
                              shopInfo={groupShop.shopInfo}
                              vouchers={
                                vouchersByMultipleShop?.filter((shop) => shop.shopId === groupShop.shopInfo.id) || []
                              }
                              checkedCartItems={checkedCartItems.filter(
                                (shop) => shop.shopInfo.id === groupShop.shopInfo.id
                              )}
                              setPickedVouchers={setPickedVouchers}
                              setTotalonShop={setTotalonShop}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
                  Select All
                </button>
                <button onClick={handlers.open} className='mx-3 border-none bg-none'>
                  Delete
                </button>

                <Modal opened={opened} onClose={handlers.close} withCloseButton={false} centered>
                  <div className='p-5'>
                    <p>Do you want to remove the {quantityCheckedCartItems} products?</p>
                    <div className='mt-8 flex justify-end'>
                      <Button className='mr-3' onClick={handlers.close}>
                        Cancel
                      </Button>
                      <Button variant='subtle' onClick={handleDeleteMultipleCartItem}>
                        Yes
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <DiscountDetailPopover
                    checkedCartItems={checkedCartItems}
                    pickedVouchers={pickedVouchers}
                    quantityCheckedCartItems={quantityCheckedCartItems}
                    totalFinalCheckedPurchasePrice={totalFinalCheckedPurchasePrice}
                  />
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Saved</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(138000)}</div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigate(path.checkout, {})
                    handleSetOrdersToProvider()
                    setCheckedCartItems(checkedCartItems)
                  }}
                  disabled={checkedCartItems.length <= 0}
                  className='disabled:bg-slate-400 mt-5 flex h-10 w-52 items-center justify-center bg-sky-400 hover:bg-sky-500 
                  transition-all ease-linear text-sm uppercase text-white sm:ml-4 sm:mt-0'
                >
                  Check Out
                </Button>
              </div>
            </div>
          </>
        )}

        {isFetchingCartSuccess && extendedCartItemsByShop.length === 0 && (
          <div className='text-center'>
            <div className='text-center'>
              <img src={noProduct} alt='no purchase' className='h-24 w-24 mx-auto' />
            </div>
            <div className='font-bold text-gray-400 mt-5'>Your cart is empty</div>
            <div className='mt-5'>
              <Link
                to={path.home}
                className='mt-5 px-10 py-2 rounded-sm uppercase text-white bg-blue hover:bg-blue/80 transition-all'
              >
                Go Shopping Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
