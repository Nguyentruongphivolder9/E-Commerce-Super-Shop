import { Carousel } from '@mantine/carousel'
import { Image } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useRef, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'

import { Button } from 'src/components/ui'
import config from 'src/constants/config'
import { convertFileToUrl } from 'src/lib/utils'
import { PostImageResponse } from 'src/types/social.type'

type FileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: PostImageResponse[]
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const initialFileUrls = mediaUrl?.map((url) => `${config.awsURL}posts/${url.imageUrl}`)
  const [files, setFiles] = useState<File[]>([])
  const [fileUrls, setFileUrls] = useState<string[]>(initialFileUrls)
  const autoplay = useRef(Autoplay({ delay: 1000 }))

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newFileUrls = acceptedFiles.map((file) => convertFileToUrl(file))
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
      fieldChange([...files, ...acceptedFiles])
      setFileUrls((prevUrls) => [...prevUrls, ...newFileUrls])
    },
    [files, fieldChange]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg']
    }
  })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />

      {fileUrls.length > 0 ? (
        <>
          <div className='flex flex-wrap justify-center w-full p-5 lg:p-10'>
            <Carousel
              withIndicators
              height='100%'
              style={{ flex: 1 }}
              loop
              controlSize={40}
              // height={400}
              slideGap='xl'
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              className='post_details-img'
            >
              {fileUrls?.map((url, index) => (
                <Carousel.Slide key={index}>
                  <Image
                    src={url || '/assets/icons/profile-placeholder.svg'}
                    height={220}
                    className='file_uploader-img'
                    alt={`Uploaded file preview ${index}`}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
          <p className='file_uploader-label'>Click or drag photo to replace</p>
        </>
      ) : (
        <div className='file_uploader-box '>
          <img src='/public/assets/icons/file-upload.svg' width={96} height={77} alt='file upload' />

          <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
          <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>

          <Button type='button' className='shad-button_dark_4'>
            Select from computer
          </Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
