import { useContext, useEffect, useState } from 'react'
import CategoryItem from 'src/components/CategoryItem'
import NoData from 'src/components/NoData'
import { AppContext } from 'src/contexts/app.context'
import { CategoryResponse } from 'src/types/category.type'

import { formatText } from 'src/utils/utils'

interface Props {
  categoryParentId: string[]
  setCategoryParentId: (value: string[]) => void
  setCategoryValue: (value: string) => void
  categoryValue: string
}

export default function CategoryParentList({
  categoryParentId,
  setCategoryParentId,
  setCategoryValue,
  categoryValue
}: Props) {
  const { categories } = useContext(AppContext)
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>(categories || [])
  const [categoriesLevel1, setCategoriesLevel1] = useState<CategoryResponse[]>([])
  const [categoriesLevel2, setCategoriesLevel2] = useState<CategoryResponse[]>([])
  const [categoriesLevel3, setCategoriesLevel3] = useState<CategoryResponse[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>(['', '', '', ''])
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (categories) {
      const categoryParts = categoryValue.split(' > ')
      const newSelectedCategory = ['', '', '', '']

      let currentCategories = categories

      categoryParts.forEach((part, index) => {
        newSelectedCategory[index] = part

        const category = currentCategories.find((category) => category.name === part)
        if (category && category.categoriesChild) {
          handlerUpdateCategoriesChild(category, index)
          currentCategories = category.categoriesChild
        }
      })

      if (categoryParts[0] == '') {
        setCategoriesLevel1([])
        setCategoriesLevel2([])
        setCategoriesLevel3([])
      }

      setSelectedCategory(newSelectedCategory)
    }
  }, [categoryValue, categories])

  // search
  useEffect(() => {
    if (searchValue && categories) {
      const searchCategory = (category: CategoryResponse, searchValue: string): boolean => {
        if (category.name.toUpperCase().includes(searchValue)) return true

        if (category.categoriesChild) {
          return category.categoriesChild
            .filter((item) => item.isChild == true)
            .some((child) => searchCategory(child, searchValue))
        }

        return false
      }

      const results: CategoryResponse[] = categories?.filter((category) => {
        return searchCategory(category, searchValue.toUpperCase())
      })

      setCategoriesLevel1([])
      setCategoriesLevel2([])
      setCategoriesLevel3([])
      setCategoriesData(results)
    } else {
      setCategoriesData(categories || [])
    }
  }, [searchValue, categories])

  const handleCategoryClick = (category: CategoryResponse, level: number) => {
    const newSelectedCategory = [...selectedCategory]
    const newCategoryParent = [...categoryParentId]

    newSelectedCategory[level] = category.name
    newCategoryParent[level] = category.id
    for (let i = level + 1; i < newSelectedCategory.length; i++) {
      newSelectedCategory[i] = ''
      newCategoryParent[i] = ''
    }
    setSelectedCategory(newSelectedCategory)

    if (category.isChild) {
      setCategoryParentId(newCategoryParent)
    }

    setCategoryValue(newSelectedCategory.filter((name) => name !== '').join(' > '))
    handlerUpdateCategoriesChild(category, level)
  }

  const handlerUpdateCategoriesChild = (category: CategoryResponse, level: number) => {
    const categoriesChild = category.categoriesChild?.filter((category) => category.isChild == true)
    switch (level) {
      case 0:
        setCategoriesLevel1(categoriesChild || [])
        setCategoriesLevel2([])
        setCategoriesLevel2([])
        break
      case 1:
        setCategoriesLevel2(categoriesChild || [])
        setCategoriesLevel3([])
        break
      case 2:
        setCategoriesLevel3(categoriesChild || [])
        break
      default:
        break
    }
  }

  return (
    <div className='relative text-sm overflow-auto flex-grow'>
      <div className='bg-[#f6f6f6]'>
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
        </div>
        <div className='relative overflow-x-auto mt-4 rounded-sm'>
          {categoriesData.length > 0 ? (
            <div className='w-full py-3 relative flex flex-row bg-white'>
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
            </div>
          ) : (
            <div className='h-96'>
              <NoData />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
