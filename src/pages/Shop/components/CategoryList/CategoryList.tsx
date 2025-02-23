import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import NoData from 'src/components/NoData'
import { AppContext } from 'src/contexts/app.context'
import { CategoryResponse } from 'src/types/category.type'
import { UseFormSetValue } from 'react-hook-form'
import { formatText } from 'src/utils/utils'
import CategoryItem from 'src/components/CategoryItem'

interface Props {
  handlerShowCategoryList: () => void
  setCategoryId: UseFormSetValue<any>
  setCategoryValue: (value: string) => void
  categoryValue: string
}

export default function CategoryList({
  handlerShowCategoryList,
  setCategoryId,
  setCategoryValue,
  categoryValue
}: Props) {
  const { categories } = useContext(AppContext)
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>(categories || [])
  const [categoriesLevel1, setCategoriesLevel1] = useState<CategoryResponse[]>([])
  const [categoriesLevel2, setCategoriesLevel2] = useState<CategoryResponse[]>([])
  const [categoriesLevel3, setCategoriesLevel3] = useState<CategoryResponse[]>([])
  const [categoriesLevel4, setCategoriesLevel4] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['', '', '', '', ''])
  const [selectedCategoryIdForSubmit, setSelectedCategoryIdForSubmit] = useState<string[]>(['', '', '', '', ''])
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(categoryValue || '')
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (categoryValue && categories) {
      const categoryParts = categoryValue.split(' > ')
      const newSelectedCategory = ['', '', '', '', '']

      let currentCategories = categories

      categoryParts.forEach((part, index) => {
        newSelectedCategory[index] = part

        const category = currentCategories.find((category) => category.name === part)
        if (category && category.categoriesChild) {
          handlerUpdateCategoriesChild(category, index)
          currentCategories = category.categoriesChild
        }
      })

      setIsSubmit(true)
      setSelectedCategory(newSelectedCategory)
    }
  }, [categoryValue, categories])

  useEffect(() => {
    if (searchValue && categories) {
      const searchCategory = (category: CategoryResponse, searchValue: string): boolean => {
        if (category.name.toUpperCase().includes(searchValue)) return true

        if (category.categoriesChild) {
          return category.categoriesChild.some((child) => searchCategory(child, searchValue))
        }

        return false
      }

      const results: CategoryResponse[] = categories?.filter((category) => {
        return searchCategory(category, searchValue.toUpperCase())
      })

      setCategoriesLevel1([])
      setCategoriesLevel2([])
      setCategoriesLevel2([])
      setCategoriesLevel4([])
      setCategoriesData(results)
    } else {
      setCategoriesData(categories || [])
    }
  }, [searchValue, categories])

  const handleCategoryClick = (category: CategoryResponse, level: number) => {
    setIsSubmit(false)
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

    if (!category.isChild) {
      setIsSubmit(true)
    }

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
    if (isSubmit) {
      setCategoryValue(selectedCategoryName)
      setCategoryId('categoryId', selectedCategoryIdForSubmit.filter((item) => item != '').join('.') ?? null)
      handlerShowCategoryList()
    }
  }

  return (
    <div className='z-50 bottom-0 top-0 left-0 right-0 fixed overflow-hidden bg-[#00000066]'>
      <div className='absolute top-10 bottom-10 left-0 right-0 flex justify-center items-center'>
        <div className='max-h-full flex relative'>
          <div className='w-[960px] bg-white border-dashed border-[1px] border-blue rounded-md shadow flex flex-col overflow-y-auto h-full'>
            <div className='min-h-6 p-6 flex-shrink-0 pr-7 text-xl font-medium overflow-hidden text-[#333333] '>
              Edit Category
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
                  <div className='text-sm text-[#999999]'>
                    How to set category,{' '}
                    <Link to={'#'} className='text-blue'>
                      Click here to learn more
                    </Link>
                  </div>
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
                  onClick={handlerShowCategoryList}
                  className='text-sm hover:bg-gray-100 text-[#999999] border border-solid border-gray-300 rounded-md px-4 py-2'
                >
                  Cancel
                </Button>
                <button
                  type='button'
                  onClick={handlerSubmitCategory}
                  className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white ${!isSubmit && 'cursor-not-allowed'}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={handlerShowCategoryList}
            type='button'
            className='text-[#999999] h-6 p-1 absolute right-12 top-6 w-6'
          >
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
      </div>
    </div>
  )
}
