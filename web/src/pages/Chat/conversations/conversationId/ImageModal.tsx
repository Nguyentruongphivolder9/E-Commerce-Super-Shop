import Modal from '../../components/Modal'

interface ImageModalProps {
  isOpen?: boolean
  onClose: () => void
  src?: string | null
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }: ImageModalProps) => {
  if (!src) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='w-80 h-80'>
        <img className='object-cover' src={src} alt='' />
      </div>
    </Modal>
  )
}

export default ImageModal
