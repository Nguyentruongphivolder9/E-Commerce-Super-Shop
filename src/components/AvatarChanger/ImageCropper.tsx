import { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import UploadImage from '../../assets/images/UploadImgIcn-removebg-preview.png'

const MIN_DIMENSION = 200
const ASPECT_RATIO = 1

type imageDetail = {
  dai: number
  rong: number
}

type imageCanva = {
  sourceImage?: File
  sourceImage_X?: number
  sourceImage_Y?: number
  sourceImage_Width?: number
  sourceImage_Height?: number
}

type ImageCropperProps = {
  avatarUrl: string
  handleSetAvatarUrl: React.Dispatch<React.SetStateAction<string>>
  handleCloseModel: React.Dispatch<React.SetStateAction<boolean>>
}

const ImageCropper = ({ avatarUrl, handleSetAvatarUrl, handleCloseModel }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop | undefined>(undefined)
  const [imgSrc, setImgSrc] = useState<string | null>(avatarUrl ? avatarUrl : null)
  const [newUpdateImage, setNewUpdateImage] = useState<imageCanva>()
  const [errMessage, setErrMessage] = useState<string | null>(null)
  const [imageDetail, setImageDetail] = useState<imageDetail>({ dai: 0, rong: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.target === e.currentTarget) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDropImage = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setNewUpdateImage({ sourceImage: file })

      const reader = new FileReader()
      reader.onload = () => {
        const imageElement = new Image()
        const imgUrl = reader.result?.toString() || ''
        imageElement.src = imgUrl

        imageElement.onload = () => {
          const { naturalHeight, naturalWidth } = imageElement
          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            setErrMessage('Chiều dài và chiều rộng của ảnh đại diện phải lớn 200px')
            setImgSrc(avatarUrl ? avatarUrl : null)
          } else {
            setImgSrc(imgUrl)
            setErrMessage(null)
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setNewUpdateImage({ sourceImage: file })
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const imageElement = new Image()
      const imgUrl = reader.result?.toString() || ''
      imageElement.src = imgUrl

      imageElement.addEventListener('load', () => {
        const { naturalHeight, naturalWidth } = imageElement
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setErrMessage('Chiều dài và chiều rộng của ảnh đại diện phải lớn 200px')
          return setImgSrc(avatarUrl ? avatarUrl : null)
        }
      })
      setImgSrc(imgUrl)
      setErrMessage(null)
    })
    reader.readAsDataURL(file)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    imgRef.current = e.currentTarget
    const { width, height } = e.currentTarget
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100
    const crop = makeAspectCrop(
      {
        unit: '%',
        width: cropWidthInPercent
      },
      ASPECT_RATIO,
      width,
      height
    )
    const centeredCrop = centerCrop(crop, width, height)
    setImageDetail({ dai: height, rong: width })
    setCrop(centeredCrop)
  }

  const handleDownload = () => {
    const imgElement = imgRef.current
    if (!imgElement) return

    // Tạo URL cho hình ảnh từ đối tượng imgElement
    const imageUrl = imgElement.src

    // Cập nhật URL của hình ảnh vào biến trạng thái hoặc xử lý nó
    handleSetAvatarUrl(imageUrl)
    handleCloseModel(true)
  }

  return (
    <div className='flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4'>
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDropImage}
        className='relative bg-cyan-100 bg-opacity-40 rounded-md border-dashed border-2 border-sky-500 w-full p-8 flex justify-center items-center'
      >
        <div
          className={`absolute inset-0 flex justify-center items-center text-white transition-all duration-300 ${
            isDragging ? 'bg-black bg-opacity-30' : 'bg-opacity-0'
          }`}
        ></div>
        <div className='text-center relative z-10'>
          <div className='flex flex-col justify-center items-center space-y-4'>
            <div className='relative'>
              <img src={UploadImage} alt='Uploaded' className='w-32' />
            </div>
            <p className='text-xl text-gray-700'>Drag & Drop to Upload Avatar Image</p>
            <p className='font-semibold text-xl text-gray-700'>Or</p>
            <label className='bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded cursor-pointer'>
              Select Image
              <input type='file' accept='image/*' onChange={onSelectFile} className='hidden' />
            </label>
          </div>
          <div className='mt-4'>
            {errMessage && (
              <div className='flex items-center text-red-500 text-xs'>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 16h-1v-4h-1m-2-4h.01M12 18h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z'
                  ></path>
                </svg>
                <p>{errMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='bg-gray-200 bg-opacity-40 rounded-md border-separate border-gray-500 border-2 w-50 p-8 flex flex-col items-center'>
        {imgSrc && (
          <>
            <div className='flex flex-col items-center'>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                circularCrop
                minWidth={150}
                minHeight={150}
                maxHeight={200}
                maxWidth={200}
                keepSelection
                aspect={ASPECT_RATIO}
              >
                <img src={imgSrc} alt='Upload' style={{ maxHeight: '250px', maxWidth: '250px' }} onLoad={onImageLoad} />
              </ReactCrop>
            </div>
            <button
              className='mt-4 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded'
              onClick={handleDownload}
            >
              Lưu
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageCropper
function handleCloseModel(arg0: boolean) {
  throw new Error('Function not implemented.')
}
