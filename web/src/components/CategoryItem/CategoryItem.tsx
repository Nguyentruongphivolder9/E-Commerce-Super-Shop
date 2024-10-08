import { CategoryResponse } from 'src/types/category.type'

interface Props {
  category: CategoryResponse
  handleCategoryClick: (category: CategoryResponse, level: number) => void
  selectedCategory: string[]
  level: number
}

export default function CategoryItem({ handleCategoryClick, category, selectedCategory, level }: Props) {
  return (
    <button
      type='button'
      onClick={() => handleCategoryClick(category, level)}
      className={`leading-8 w-full px-4 flex flex-row justify-between items-center cursor-pointer ${selectedCategory[level] == category.name ? 'text-blue' : 'text-[#333333]'}`}
    >
      <p className='line-clamp-1 flex-1 text-left'>{category.name}</p>
      {category.isChild && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
        </svg>
      )}
    </button>
  )
}
