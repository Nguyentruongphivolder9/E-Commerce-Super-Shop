import { Input, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import categoryOfShopApi from 'src/apis/categoryOfShop.api'
import config from 'src/constants/config'
import { imageFileConvertToUrl } from 'src/utils/utils'

export default function ModalAddCategoryOfShop() {
  const queryClient = useQueryClient()
  const [opened, { close, open }] = useDisclosure(false)
  const fileInputImagesRef = useRef<HTMLInputElement>(null)
  const [fileImage, setFileImage] = useState<File | null>(null)
  const [name, setName] = useState<string>('')
  const [errorFileImage, setErrorFileImage] = useState<string>('')

  const categoryCreateMutation = useMutation({
    mutationFn: categoryOfShopApi.addCategory
  })

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileImage(null)
    const files = event.target.files

    if (!files || files.length === 0) return

    const fileExtension = files[0].name.split('.').pop()?.toLowerCase()
    const validExtensions = ['png', 'jpg', 'jpeg']

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      setErrorFileImage('Invalid file format. Please select a valid file format: ' + validExtensions.join(', '))
    } else if (files[0].type.split('/')[0] !== 'image') {
      setErrorFileImage('The file is not an image. Please select an image file.')
    } else if (files[0].size > 2097152) {
      setErrorFileImage('The file size exceeds the 2MB limit. Please select a smaller file.')
    } else {
      setFileImage(files[0])
    }
  }

  const submit = async () => {
    const formData = new FormData()
    formData.append('id', '')
    formData.append('name', name)
    formData.append('imageFile', fileImage != null ? fileImage : '')

    try {
      const createProRes = await categoryCreateMutation.mutateAsync(formData)
      if (createProRes.data.statusCode === 201) {
        toast.success(createProRes.data.message)
        const filters: InvalidateQueryFilters = { queryKey: [config.GET_LIST_CATEGORIES_OF_SHOP_QUERY_KEY] }
        queryClient.invalidateQueries(filters)
        close()
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred while creating the category'
      console.log(errorMessage)
    }
  }

  const handleUploadImages = () => {
    fileInputImagesRef.current?.click()
  }
  return (
    <div className='h-auto w-auto'>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title='Add Category'
        transitionProps={{ transition: 'fade', duration: 200 }}
        size={500}
      >
        <div className=' relative bg-white h-auto'>
          <div className='flex flex-col'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-2'>
                <div className='text-[#333333] text-sm'>Category Image</div>
                {fileImage != null ? (
                  <div className='group w-24 h-24 relative border-dashed border-2 border-blue rounded-md overflow-hidden flex items-center'>
                    <img
                      className='object-cover h-full w-full cursor-move'
                      src={`${imageFileConvertToUrl(fileImage)}`}
                      alt={'upload file'}
                    />
                    <div className='absolute bottom-0 left-0 w-full h-6 bg-[#333333] hidden group-hover:grid group-hover:grid-cols-2 '>
                      <div className='col-span-1'></div>
                      <div className='col-span-1 items-center justify-center flex'>
                        <button
                          type='button'
                          onClick={() => {
                            setFileImage(null)
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
                ) : (
                  <div className='w-24 h-24 border-dashed border-2 border-blue rounded-md flex items-center justify-center'>
                    <input
                      className='hidden'
                      type='file'
                      accept='.jpg,.jpeg,.png'
                      ref={fileInputImagesRef}
                      onChange={onFileChange}
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
                        <span>Add Image</span>
                      </div>
                    </button>
                  </div>
                )}
                {errorFileImage != '' && <div className='mt-1 h-4 text-xs px-2 text-[#ff4742]'>{errorFileImage}</div>}
              </div>
              <Input.Wrapper className='text-[#333333]' label='Category Name' error=''>
                <Input
                  maxLength={40}
                  placeholder='Enter a category display name'
                  onChange={(e) => setName(e.target.value)}
                />
              </Input.Wrapper>
            </div>
            <div className='p-6 flex flex-row justify-end gap-2'>
              <button
                type='button'
                onClick={close}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 text-[#333333]`}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={name.length > 0 ? submit : () => {}}
                className={`${name.length <= 0 && 'cursor-not-allowed opacity-65'} text-sm capitalize border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button
        className='text-[#ffffff] bg-blue text-md px-5 py-[6px] flex items-center justify-center rounded-md'
        type='button'
        onClick={open}
      >
        Add Category
      </button>
    </div>
  )
}
