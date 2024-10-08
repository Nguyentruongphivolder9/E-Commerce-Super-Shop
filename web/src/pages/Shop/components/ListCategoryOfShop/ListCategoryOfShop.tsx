import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useContext, useEffect, useMemo, useState } from 'react'
import Button from 'src/components/Button'
import CategoryItem from 'src/components/CategoryItem'
import NoData from 'src/components/NoData'
import { AppContext } from 'src/contexts/app.context'
import { CategoryResponse } from 'src/types/category.type'
import { formatText } from 'src/utils/utils'

interface Props {
  setCategoryId: (value: string) => void
  listCategoryOfShopData?: string[]
  categoryId: string
}

export default function ListCategoryOfShop({ setCategoryId, categoryId, listCategoryOfShopData }: Props) {
  const [opened, { open, close }] = useDisclosure(false)
  const { categories } = useContext(AppContext)
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([])
  const [categoriesLevel1, setCategoriesLevel1] = useState<CategoryResponse[]>([])
  const [categoriesLevel2, setCategoriesLevel2] = useState<CategoryResponse[]>([])
  const [categoriesLevel3, setCategoriesLevel3] = useState<CategoryResponse[]>([])
  const [categoriesLevel4, setCategoriesLevel4] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['', '', '', '', ''])
  const [selectedCategoryIdForSubmit, setSelectedCategoryIdForSubmit] = useState<string[]>(['', '', '', '', ''])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (categoriesData) {
      const newSelectedCategory = ['', '', '', '', '']
      const categoryIdCurrent = categoryId.split('.')[categoryId.split('.').length - 1]

      const findCategoryName = (category: CategoryResponse, id: string, level: number): boolean => {
        if (category.id == id) {
          newSelectedCategory[level] = category.name
          return true
        } else {
          if (category.categoriesChild) {
            const isCate = category.categoriesChild.some((child) => findCategoryName(child, id, level + 1))
            if (isCate) {
              newSelectedCategory[level] = category.name
            }
            return isCate
          }
        }
        return false
      }
      for (let i = 0; i < categoriesData.length; i++) {
        const isCate = findCategoryName(categoriesData[i], categoryIdCurrent, 0)

        if (isCate) {
          newSelectedCategory[0] = categoriesData[i].name
        }
      }

      setSelectedCategoryName(newSelectedCategory.filter((name) => name !== '').join(' > '))
    }
  }, [categoriesData, categoryId])

  useEffect(() => {
    if (categories && listCategoryOfShopData) {
      const listCategoryIds = categories

      const filterCategoryChildren = (
        category: CategoryResponse,
        shopCategoryIds: string[]
      ): CategoryResponse | null => {
        const validChildren =
          (category.categoriesChild
            ?.map((child) => filterCategoryChildren(child, shopCategoryIds))
            .filter((child) => child !== null) as CategoryResponse[]) || []

        if (shopCategoryIds.includes(category.id) || validChildren.length > 0) {
          return {
            ...category,
            categoriesChild: validChildren
          }
        }
        return null
      }

      const results = listCategoryIds
        .map((category) => filterCategoryChildren(category, listCategoryOfShopData))
        .filter((category) => category !== null) as CategoryResponse[]

      setCategoriesData(results)
    }
  }, [listCategoryOfShopData, categories])

  useEffect(() => {
    if (searchValue && categoriesData) {
      const searchCategory = (category: CategoryResponse, searchValue: string): boolean => {
        if (category.name.toUpperCase().includes(searchValue)) return true

        if (category.categoriesChild) {
          return category.categoriesChild.some((child) => searchCategory(child, searchValue))
        }

        return false
      }

      const results: CategoryResponse[] = categoriesData?.filter((category) => {
        return searchCategory(category, searchValue.toUpperCase())
      })

      setCategoriesLevel1([])
      setCategoriesLevel2([])
      setCategoriesLevel2([])
      setCategoriesLevel4([])
      setCategoriesData(results)
    }
  }, [searchValue, categoriesData])

  const handleCategoryClick = (category: CategoryResponse, level: number) => {
    const newSelectedCategoryName = [...selectedCategory]
    const newSelectedCategoryId = [...selectedCategoryIdForSubmit]

    newSelectedCategoryName[level] = category.name
    for (let i = level + 1; i < newSelectedCategoryName.length; i++) {
      newSelectedCategoryName[i] = ''
    }
    setSelectedCategory(newSelectedCategoryName)

    newSelectedCategoryId[level] = category.id
    for (let i = level + 1; i < newSelectedCategoryName.length; i++) {
      newSelectedCategoryId[i] = ''
    }
    setSelectedCategoryIdForSubmit(newSelectedCategoryId)

    setSelectedCategoryName(newSelectedCategoryName.filter((name) => name !== '').join(' > '))
    handlerUpdateCategoriesChild(category, level)
  }

  const handlerUpdateCategoriesChild = (category: CategoryResponse, level: number) => {
    switch (level) {
      case 0:
        setCategoriesLevel1(category.categoriesChild || [])
        setCategoriesLevel2([])
        setCategoriesLevel2([])
        setCategoriesLevel4([])
        break
      case 1:
        setCategoriesLevel2(category.categoriesChild || [])
        setCategoriesLevel3([])
        setCategoriesLevel4([])
        break
      case 2:
        setCategoriesLevel3(category.categoriesChild || [])
        setCategoriesLevel4([])
        break
      case 3:
        setCategoriesLevel4(category.categoriesChild || [])
        break
      default:
        break
    }
  }

  const handlerSubmitCategory = () => {
    setCategoryId(selectedCategoryIdForSubmit.filter((item) => item != '').join('.'))
    close()
  }

  return (
    <div>
      <Modal size={'70%'} opened={opened} onClose={close} withCloseButton={false} centered>
        <div className='w-full max-h-full flex relative'>
          <div className='w-full bg-white flex flex-col overflow-y-auto h-full'>
            <div className='min-h-6 p-6 flex-shrink-0 pr-7 text-xl font-medium overflow-hidden text-[#333333] '>
              Select Category
            </div>
            <div className='relative text-sm px-6 overflow-auto flex-grow'>
              <div className='p-4 bg-[#f6f6f6]'>
                <div className='flex flex-row justify-between items-center h-8'>
                  <div className='w-72 flex-row flex items-center bg-white border border-solid border-[#e5e5e5] rounded-md overflow-hidden text-'>
                    <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full cursor-pointer'>
                      <input
                        type='text'
                        onChange={(e) => setSearchValue(formatText(e.target.value))}
                        className='text-sm text-[#333333] w-full border-none outline-none pr-3 placeholder:text-[#999999]'
                        placeholder='Please input least 1 character'
                      />
                      <div className='flex-shrink-0 bg-orange hover:opacity-95 text-[#999999]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-5'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* <div className='text-sm text-[#999999]'>
                    How to set category,{' '}
                    <Link to={'#'} className='text-blue'>
                      Click here to learn more
                    </Link>
                  </div> */}
                </div>
                <div className='relative overflow-x-auto mt-4 rounded-sm'>
                  {categoriesData ? (
                    <div className='w-[1200px] py-3 relative flex flex-row bg-white'>
                      <ul className='h-80 flex-1 overflow-y-auto scrollbar-webkit scrollbar-thin'>
                        {categoriesData.map((category, index) => (
                          <li key={index}>
                            <CategoryItem
                              category={category}
                              handleCategoryClick={handleCategoryClick}
                              selectedCategory={selectedCategory}
                              level={0}
                            />
                          </li>
                        ))}
                      </ul>
                      <ul className='h-80 flex-1 overflow-y-auto scrollbar-webkit scrollbar-thin border-l-2'>
                        {categoriesLevel1 &&
                          categoriesLevel1.map((category, index) => (
                            <li key={index}>
                              <CategoryItem
                                category={category}
                                handleCategoryClick={handleCategoryClick}
                                selectedCategory={selectedCategory}
                                level={1}
                              />
                            </li>
                          ))}
                      </ul>
                      <ul className='h-80 flex-1 overflow-y-auto scrollbar-webkit scrollbar-thin border-l-2'>
                        {categoriesLevel2 &&
                          categoriesLevel2.map((category, index) => (
                            <li key={index}>
                              <CategoryItem
                                category={category}
                                handleCategoryClick={handleCategoryClick}
                                selectedCategory={selectedCategory}
                                level={2}
                              />
                            </li>
                          ))}
                      </ul>
                      <ul className='h-80 flex-1 overflow-y-auto scrollbar-webkit scrollbar-thin border-l-2'>
                        {categoriesLevel3 &&
                          categoriesLevel3.map((category, index) => (
                            <li key={index}>
                              <CategoryItem
                                category={category}
                                handleCategoryClick={handleCategoryClick}
                                selectedCategory={selectedCategory}
                                level={3}
                              />
                            </li>
                          ))}
                      </ul>
                      <ul className='h-80 flex-1 overflow-y-auto scrollbar-webkit scrollbar-thin border-l-2'>
                        {categoriesLevel4 &&
                          categoriesLevel4.map((category, index) => (
                            <li key={index}>
                              <CategoryItem
                                category={category}
                                handleCategoryClick={handleCategoryClick}
                                selectedCategory={selectedCategory}
                                level={4}
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  ) : (
                    <div className='h-96'>
                      <NoData />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='flex flex-row  justify-between items-center p-6 '>
              <div className='text-sm text-[#666666]'>
                <span>The currently selected: </span>
                {selectedCategoryName ? (
                  <span className='text-[#333333] font-bold'>{selectedCategoryName}</span>
                ) : (
                  'No category has been chosen'
                )}
              </div>
              <div className='flex flex-row gap-5'>
                <Button
                  onClick={close}
                  className='text-sm hover:bg-gray-100 text-[#999999] border border-solid border-gray-300 rounded-md px-4 py-2'
                >
                  Cancel
                </Button>
                <button
                  type='button'
                  onClick={handlerSubmitCategory}
                  className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
          <button onClick={close} type='button' className='text-[#999999] h-6 p-1 absolute right-12 top-6 w-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </Modal>

      <div onClick={open} className='px-5 border h-10 w-full rounded-md flex items-center p-1'>
        <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full'>
          <div className='text-sm text-[#999999]'>
            {selectedCategoryName ? selectedCategoryName : 'Search by category'}
          </div>
          <div className='flex-shrink-0 bg-orange hover:opacity-95'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-5 text-[#999999]'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
