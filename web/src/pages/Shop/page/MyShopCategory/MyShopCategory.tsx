import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import categoryOfShopApi from 'src/apis/categoryOfShop.api'
import NoData from 'src/components/NoData'
import config from 'src/constants/config'
import SwitchActive from './SwitchActive'
import ModalAddCategoryOfShop from './ModalAddCategoryOfShop'
import { useState } from 'react'
import ModalCategoryOfShopAddProduct from './ModalCategoryOfShopAddProduct'
import ModalEditCategoryOfShop from './ModalEditCategoryOfShop'
import { toast } from 'react-toastify'

export default function MyShopCategory() {
  const [selectedCateId, setSelectedCateID] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: categoriesData } = useQuery({
    queryKey: [config.GET_LIST_CATEGORIES_OF_SHOP_QUERY_KEY],
    queryFn: () => categoryOfShopApi.getAllListCategoryOfShop()
  })
  const categories = categoriesData?.data.body

  const toggleDisplayStatusMutation = useMutation({
    mutationFn: categoryOfShopApi.toggleDisplayStatusCategoryOfShop
  })

  const handleEditClick = (categoryId: string) => {
    setSelectedCateID(categoryId)
    setModalOpen(true)
  }

  const handleClickSwitch = async (categoryId: string) => {
    try {
      const res = await toggleDisplayStatusMutation.mutateAsync(categoryId)
      if (res.data.statusCode === 200) {
        toast.success(res.data.message)
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='w-full'>
      {selectedCateId != null && (
        <ModalCategoryOfShopAddProduct
          categoryOfShopId={selectedCateId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
      <div className='h-10 w-full mb-2 flex flex-row justify-between items-center'>
        <div className='text-xl'>My Shop Category</div>
        <ModalAddCategoryOfShop />
      </div>
      <div className='w-full bg-white rounded-xl px-6 pt-2 pb-6 shadow-sm'>
        <div>
          <div className='border-[1px] border-gray-200 rounded-md overflow-hidden'>
            <div className='px-4 py-1 flex flex-row text-sm bg-[#F6F6F6]'>
              <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
                <div className='flex justify-start text-[#999999] col-span-6'>Category name</div>
                <div className='flex justify-start text-[#999999] col-span-3'>Product(s)</div>
                <div className='flex justify-start text-[#999999] col-span-3'>Display</div>
              </div>
              <div className='flex items-center w-60 py-3 pl-2 pr-4 text-[#999999]'>Action</div>
            </div>
            {categories && categories.length > 0 ? (
              categories.map((category, index) => (
                <div className='mb-3' key={index}>
                  <div className='px-4 flex h-auto col-span-2 rounded-sm overflow-hidden'>
                    <div className='py-3 px-2 flex-1 grid grid-cols-12 items-start'>
                      <div className='flex justify-start text-[#999999] col-span-6'>
                        <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                          {category.imageUrl != '' && (
                            <div className='w-14 h-14'>
                              <img
                                className='w-full h-full object-cover'
                                src={`${config.awsURL}categories-of-shop/${category.imageUrl}`}
                                alt={category.name}
                              />
                            </div>
                          )}
                          <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                            <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{category.name}</div>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                        {category.totalProduct}
                      </div>
                      <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                        <SwitchActive
                          handleClickSwitch={() => handleClickSwitch(category.id)}
                          isAction={category.totalProduct > 0}
                          isDisplay={category.isActive}
                        />
                      </div>
                    </div>
                    <div className='flex gap-3 justify-start w-60 text-sm items-start text-blue py-3 pl-2 pr-4'>
                      <button className='hover:text-blue text-sm' onClick={() => handleEditClick(category.id)}>
                        Add Product
                      </button>
                      <ModalEditCategoryOfShop category={category} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='w-full h-96'>
                <NoData title='No Product Found' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
