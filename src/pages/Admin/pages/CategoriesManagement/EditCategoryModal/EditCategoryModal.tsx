import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'
import { CategoryImageResponse, CategoryResponse } from 'src/types/category.type'
import { CategoryImagesRequest } from '../CreateCategory/CreateCategory'
import { AppContext } from 'src/contexts/app.context'
import categoryApi from 'src/apis/category.api'
import { formatText, imageFileConvertToUrl } from 'src/utils/utils'
import CategoryParentList from '../CreateCategory/CategoryParentList'
import { Loader, Modal, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface Props {
  categoryId: string
  isOpen: boolean
  onClose: () => void
}

export default function EditCategoryModal({ categoryId, isOpen, onClose }: Props) {
  const { categories } = useContext(AppContext)
  const queryClient = useQueryClient()
  const fileInputImagesRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<CategoryImagesRequest[]>([])
  const [currentImages, setCurrentImages] = useState<CategoryImageResponse[]>([])
  const [limitImages, setLimitImages] = useState<number>(1)
  const [categoryName, setCategoryName] = useState<string>('')
  const [categoryType, setCategoryType] = useState<string>('parentPrimary')
  const [categoryParentId, setCategoryParentId] = useState<string[]>(['', '', '', ''])
  const [categoryNameError, setCategoryNameError] = useState<string>('')
  const [imageError, setImageError] = useState<string>('')
  const [categoryParentIdError, setCategoryParentIdError] = useState<string>('')
  const [categoryValueSelected, setCategoryValueSelected] = useState<string>('')
  const [categoryEdit, setCategoryEdit] = useState<CategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const categoryUpdateMutation = useMutation({
    mutationFn: categoryApi.updateCategory
  })

  useEffect(() => {
    if (categoryId && categories) {
      const findCategoryById = (category: CategoryResponse, categoryId: string) => {
        if (category.id == categoryId) {
          setCategoryEdit(category)
        } else {
          if (category.categoriesChild) {
            category.categoriesChild.forEach((child) => {
              findCategoryById(child, categoryId)
            })
          }
        }
      }
      categories.forEach((category) => {
        findCategoryById(category, categoryId)
      })
    }
  }, [categoryId, categories])

  useEffect(() => {
    if (categoryEdit != null) {
      setCategoryName(categoryEdit.name)

      if (categoryEdit.parentId == null) {
        setLimitImages(1)
        setCurrentImages(categoryEdit.categoryImages)
        setCategoryType('parentPrimary')
      } else {
        if (categoryEdit.isChild) {
          setLimitImages(0)
          setCategoryType('parentLevel')
        } else {
          setCategoryType('children')
          setCurrentImages(categoryEdit.categoryImages)
          setLimitImages(3)
        }
        const currentCategoryParentId = categoryEdit.parentId.split('.')
        const newCategoryParentId = ['', '', '', '']

        for (let i = 0; i < currentCategoryParentId.length; i++) {
          newCategoryParentId[i] = currentCategoryParentId[i]
        }
        setCategoryParentId(newCategoryParentId)
      }
      if (categoryEdit.parentId && categories) {
        const newSelectedCategory = ['', '', '', '']
        const categoryId = categoryEdit.parentId.split('.')[categoryEdit.parentId.split('.').length - 1]

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
        for (let i = 0; i < categories.length; i++) {
          const isCate = findCategoryName(categories[i], categoryId, 0)

          if (isCate) {
            newSelectedCategory[0] = categories[i].name
          }
        }

        setCategoryValueSelected(newSelectedCategory.filter((name) => name !== '').join(' > '))
      }
    }
  }, [categoryEdit])

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files || files.length === 0) return

    let maxImages = 3
    if (categoryType == 'parentPrimary') {
      maxImages = 1
    }
    const currentImageCount = images.length
    const remainingSlots = maxImages - currentImageCount
    const filesToAdd = Math.min(files.length, remainingSlots)

    for (let i = 0; i < filesToAdd; i++) {
      const fileExtension = files[i].name.split('.').pop()?.toLowerCase()
      const validExtensions = ['png', 'jpg', 'jpeg']

      if (!fileExtension || !validExtensions.includes(fileExtension)) continue
      if (files[i].type.split('/')[0] !== 'image') continue

      if (files[i].size > 2097152) continue

      setImages((prev) => [...prev, { id: i, imageFile: files[i] }])
      setCurrentImages([])
    }
  }

  const deleteImage = async (id: number) => {
    setImages(images.filter((image) => image.id !== id))
  }

  const handleUploadImages = () => {
    fileInputImagesRef.current?.click()
  }

  const handlerUpdateCategory = async () => {
    const formData = new FormData()
    setIsLoading(true)
    setCategoryNameError('')
    setImageError('')
    setCategoryParentIdError('')
    let isError = false
    if (categoryName == null || categoryName.length == 0 || categoryName == undefined || categoryName == '') {
      isError = true
      setCategoryNameError('This field cannot be empty')
      setIsLoading(false)
    } else {
      let resultFindByCategoryName: CategoryResponse[] = []
      if (categoryParentId && categoryName != categoryEdit?.name) {
        const findCategoryName = (category: CategoryResponse, value: string): boolean => {
          if (category.id == categoryParentId[0]) {
            return category.categoriesChild?.some((child) => child.name.toUpperCase() == value)
          } else {
            if (category.categoriesChild) {
              return category.categoriesChild
                .filter((item) => item.isChild == true)
                .some((child) => findCategoryName(child, value))
            }
          }
          return false
        }

        resultFindByCategoryName =
          categories?.filter((category: CategoryResponse) => {
            return findCategoryName(category, categoryName.toUpperCase())
          }) || []
      } else {
        resultFindByCategoryName =
          categories?.filter(
            (category: CategoryResponse) => category.name.toUpperCase() == categoryName.toUpperCase()
          ) || []
      }

      if (resultFindByCategoryName.length > 0) {
        isError = true
        setCategoryNameError('Duplicate category name: ' + categoryName)
        setIsLoading(false)
      }
    }

    switch (categoryType) {
      case 'parentPrimary':
        if (currentImages.length == 0 && images.length != 1) {
          isError = true
          setImageError('Image is missing, please make sure at least this category has 1 image.')
          setIsLoading(false)
        }
        formData.append('isChild', 'true')
        break
      case 'parentLevel':
        if (
          categoryParentId == null ||
          categoryParentId.length == 0 ||
          categoryParentId == undefined ||
          categoryParentId[0] == ''
        ) {
          isError = true
          setIsLoading(false)
          setCategoryParentIdError('This field cannot be empty')
        }
        formData.append('isChild', 'true')
        break
      case 'children':
        if (currentImages.length == 0 && images.length != 3) {
          isError = true
          setIsLoading(false)
          setImageError('Image is missing, please make sure at least this category has 3 image.')
        }
        if (
          categoryParentId == null ||
          categoryParentId.length == 0 ||
          categoryParentId == undefined ||
          categoryParentId[0] == ''
        ) {
          isError = true
          setIsLoading(false)
          setCategoryParentIdError('This field cannot be empty')
        }
        formData.append('isChild', 'false')
        break
      default:
        break
    }

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('imageFiles', images[i].imageFile)
      }
    } else {
      formData.append('imageFiles', '')
    }
    formData.append('parentId', categoryParentId.filter((item) => item != '').join('.') ?? null)
    formData.append('name', categoryName)
    formData.append('isActive', 'true')
    formData.append('id', categoryId)

    if (!isError) {
      try {
        const createProRes = await categoryUpdateMutation.mutateAsync(formData)
        if (createProRes.data.statusCode === 200) {
          toast.success('Create Category successfully')
          const filters: InvalidateQueryFilters = { queryKey: [config.GET_CATEGORIES_QUERY_KEY] }
          queryClient.invalidateQueries(filters)
          handleClose()
        }
      } catch (error: any) {
        console.log(error)
        const errorMessage = error.response?.data?.error || 'An error occurred while creating the category'
        setCategoryNameError(errorMessage)
        setIsLoading(false)
      }
    }
  }

  const handleClose = () => {
    setImages([])
    setCurrentImages([])
    setLimitImages(1)
    setCategoryName('')
    setCategoryType('parentPrimary')
    setCategoryParentId(['', '', '', ''])
    setCategoryNameError('')
    setImageError('')
    setCategoryParentIdError('')
    setCategoryValueSelected('')
    setCategoryEdit(null)
    setIsLoading(false)
    onClose()
  }

  return (
    <>
      <Modal size={1100} opened={isOpen} onClose={handleClose} centered withCloseButton={false}>
        <div className='max-h-full flex relative'>
          <div className='w-full bg-white flex flex-col overflow-y-auto h-full'>
            <div className='min-h-6 p-6 flex-shrink-0 pr-7 text-xl font-medium overflow-hidden text-[#333333] '>
              Create Category
            </div>
            <div className='relative text-sm px-6 flex-grow max-h-[450px] overflow-y-auto scrollbar-thin'>
              <div className='p-4 bg-[#f6f6f6]'>
                <div className='grid grid-cols-8 gap-4 mb-1'>
                  <div className='h-10 col-span-2 flex items-center text-[#333333] justify-end gap-2'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Category Name</div>
                  </div>
                  <div className='flex flex-col col-span-6 items-start'>
                    <div
                      className={`w-full h-10 px-2 flex items-center bg-white border border-solid rounded-md overflow-hidden ${categoryNameError ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                    >
                      <div className='bg-white rounded-sm p-1 h-full w-full flex items-center flex-row justify-between'>
                        <input
                          type='text'
                          maxLength={50}
                          value={categoryName}
                          className='text-sm text-[#333333] w-full border-none outline-none pr-3'
                          placeholder='Example: Hair Ties, Ribbons & Scrunchies'
                          onChange={(e) => setCategoryName(formatText(e.target.value))}
                        />
                        <div className='text-sm text-[#999999]'>{categoryName.length}/50</div>
                      </div>
                    </div>
                    <div
                      className={`${categoryNameError ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {categoryNameError}
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-8 gap-4 mb-4'>
                  <div className='h-10 col-span-2 flex items-center text-[#333333] justify-end gap-2'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Category Type</div>
                  </div>
                  <div className='flex flex-row col-span-6 justify-between items-center h-10'>
                    <Select
                      className='w-60 h-full'
                      value={categoryType}
                      defaultValue={categoryType}
                      disabled
                      data={[
                        { value: 'parentPrimary', label: 'Parent Primary' },
                        { value: 'parentLevel', label: 'Parent Level' },
                        { value: 'children', label: 'Children' }
                      ]}
                      onChange={(value) => {
                        switch (value) {
                          case 'parentPrimary':
                            setLimitImages(1)
                            break
                          case 'parentLevel':
                            setLimitImages(0)
                            break
                          case 'children':
                            setLimitImages(3)
                            break
                          default:
                            break
                        }
                        if (value != categoryType) {
                          setImages([])
                          setCategoryParentId(['', '', '', ''])
                          setCategoryValueSelected('')
                        }
                        setCategoryType(value!)
                      }}
                    />
                  </div>
                </div>
                {(categoryType == 'parentPrimary' || categoryType == 'children') && (
                  <div className='grid grid-cols-8 mb-3'>
                    <div className='col-span-2 flex flex-row justify-end items-center h-10 gap-1 mr-5'>
                      <span className='text-red-600 text-xs'>*</span>
                      <div className='text-sm text-[#333333]'>Product Images</div>
                    </div>
                    <div className='col-span-6 flex flex-col justify-center'>
                      <div className='p-1 flex-wrap flex items-center flex-row gap-3 w-full'>
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className='group w-24 h-24 relative border-dashed border-2 border-blue rounded-md overflow-hidden flex items-center'
                          >
                            <img
                              className='object-cover h-full w-full cursor-move'
                              src={imageFileConvertToUrl(image.imageFile)}
                              alt={'upload file'}
                            />
                            <div className='absolute bottom-0 left-0 w-full h-6 bg-[#333333] hidden group-hover:grid group-hover:grid-cols-2 '>
                              <div className='col-span-1'></div>
                              <div className='col-span-1 items-center justify-center flex'>
                                <button
                                  type='button'
                                  onClick={() => {
                                    deleteImage(image.id)
                                  }}
                                  className='w-fit h-fit'
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='18'
                                    height='18'
                                    fill='#fff'
                                    viewBox='0 0 256 256'
                                  >
                                    <path d='M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z'></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {images.length < limitImages && (
                          <div className=' p-1 flex-wrap flex items-center flex-row gap-3'>
                            {images.length == 0 &&
                              currentImages.length > 0 &&
                              currentImages.map((item, index) => (
                                <div
                                  key={index}
                                  className='group w-24 h-24 relative border-dashed border-2 border-blue rounded-md overflow-hidden flex items-center'
                                >
                                  <img
                                    className='object-cover h-full w-full'
                                    src={`${config.awsURL}categories/${item.imageUrl}`}
                                    alt={'upload file'}
                                  />
                                </div>
                              ))}
                            <div className='w-24 h-24 border-dashed border-2 border-blue rounded-md flex items-center justify-center'>
                              <input
                                className='hidden'
                                type='file'
                                accept='.jpg,.jpeg,.png'
                                ref={fileInputImagesRef}
                                onChange={onFileChange}
                                multiple
                              />
                              <button
                                className='h-full w-full flex flex-col justify-center items-center'
                                type='button'
                                onClick={handleUploadImages}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width={30}
                                  height={30}
                                  fill='#0099FF'
                                  viewBox='0 0 256 256'
                                >
                                  <path d='M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z' />
                                </svg>
                                <div className='text-xs text-blue flex flex-col'>
                                  <span>Change images</span>
                                  <span>
                                    ({images.length}/{limitImages})
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`${imageError ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}>
                        {imageError}
                      </div>
                    </div>
                  </div>
                )}
                {(categoryType == 'parentLevel' || categoryType == 'children') && (
                  <div>
                    <div className='grid grid-cols-8 gap-4 mb-4'>
                      <div className='h-10 col-span-2 flex items-center text-[#333333] justify-end gap-2'>
                        <span className='text-red-600 text-xs'>*</span>
                        <div className='text-sm text-[#333333]'>Category Parent</div>
                      </div>
                      <div className='flex flex-col col-span-6 items-start '>
                        <div
                          className={`w-full h-10 px-2 flex items-center bg-white border border-solid rounded-md overflow-hidden ${categoryParentIdError ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                        >
                          <div className='bg-white rounded-sm p-1 h-full w-full flex items-center flex-row justify-between'>
                            <input
                              type='text'
                              value={(categoryValueSelected ? categoryValueSelected + ' > ' : '') + categoryName}
                              className='text-sm text-[#333333] w-full border-none outline-none'
                              placeholder='No category has been chosen'
                              readOnly
                            />
                          </div>
                        </div>
                        <div
                          className={`${categoryParentIdError ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                        >
                          {categoryParentIdError}
                        </div>
                      </div>
                    </div>
                    <div className='relative mt-4 rounded-sm'>
                      <CategoryParentList
                        categoryParentId={categoryParentId}
                        setCategoryParentId={setCategoryParentId}
                        setCategoryValue={setCategoryValueSelected}
                        categoryValue={categoryValueSelected}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className='flex flex-row justify-end items-center p-6 '>
              <div className='flex flex-row gap-5'>
                <button
                  onClick={handleClose}
                  className='text-sm hover:bg-gray-100 text-[#999999] border border-solid border-gray-300 rounded-md px-4 py-2'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  disabled={isLoading}
                  onClick={handlerUpdateCategory}
                  className={`${isLoading ? 'cursor-not-allowed flex gap-3 bg-white text-[#999999]' : 'bg-blue text-white'} text-sm border border-solid border-gray-300 rounded-md px-4 py-2 `}
                >
                  {isLoading && <Loader size={20} color='redrgba(255, 255, 255, 1)' />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleClose} type='button' className='text-[#999999] h-6 p-1 absolute right-12 top-6 w-6'>
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
    </>
  )
}
