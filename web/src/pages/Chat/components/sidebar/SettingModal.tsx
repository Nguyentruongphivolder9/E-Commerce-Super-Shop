import axios from 'axios'

import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

import Modal from 'src/pages/Chat/components/Modal'

// import { CldUploadButton } from 'next-cloudinary'

import { User } from 'src/types/user.type'
import Button from 'src/pages/Chat/components/Button'
import { toast } from 'react-toastify'
import Input from 'src/pages/Chat/components/input/Input'
import { getAvatarUrl } from 'src/utils/utils'

interface SettingModalProps {
  isOpen?: boolean
  onClose: () => void
  currentUser: User
}

const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose, currentUser }: SettingModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.userName,
      image: currentUser?.avatarUrl
    }
  })

  const image = watch('image')

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, { shouldValidate: true })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios
      .post('/api/settings', data)
      .then(() => {
        // router.refresh()
        onClose()
      })
      .catch(() => {
        toast.error('Something went wrong!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>Profile</h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>Edit your public information.</p>

            <div className='mt-10 flex flex-col gap-y-8'>
              <Input disabled={isLoading} label='Name' id='name' errors={errors} register={register} />
              <div>
                <label htmlFor='image' className='block text-sm font-medium leading-6 text-gray-900'>
                  Photo
                </label>
                <div className='mt-2 flex items-center gap-x-3'>
                  <img
                    width='48'
                    height='48'
                    className='rounded-full'
                    src={image || currentUser?.avatarUrl || getAvatarUrl(currentUser?.email)}
                    alt='Avatar'
                  />
                  {/* <CldUploadButton options={{ maxFiles: 1 }} onSuccess={handleUpload} uploadPreset='lgxlav1q'>
                    <Button disabled={isLoading} secondary type='button'>
                      Change
                    </Button>
                  </CldUploadButton> */}
                </div>
              </div>
            </div>
          </div>

          <div className='mt-6 flex items-center justify-end gap-x-6'>
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type='submit'>
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingModal
