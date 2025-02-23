import ButtonModal from '../ButtonModal/ButtonModal'

interface Props {
  categoryId: string
  className: string
  handleDeleteCate: (close: () => void) => void
  isShowButton: boolean
}

export default function ButtonDeleteCate({ categoryId, className, handleDeleteCate, isShowButton }: Props) {
  return (
    <ButtonModal
      size={500}
      title='Delete category'
      nameButton='Delete'
      className={className}
      handleSubmit={handleDeleteCate}
      isShowButton={isShowButton}
    >
      <div className='w-full relative bg-white h-auto mb-3'>
        <div className=' text-[#333333] flex justify-start items-center'>
          <span className='text-xl'>are you sure you want to delete the category whose id is {categoryId} ?</span>
        </div>
      </div>
    </ButtonModal>
  )
}
