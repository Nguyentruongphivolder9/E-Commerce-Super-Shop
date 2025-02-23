import { useMutation, useQueryClient } from '@tanstack/react-query'
import ButtonModal from '../ButtonModal/ButtonModal'
import config from 'src/constants/config'
import { ProductDetailForAdminResponse, ProductViolationHistory } from 'src/types/product.type'
import { formatDateTime } from 'src/utils/utils'
import { toast } from 'react-toastify'
import violationApi from 'src/apis/violation.api'

interface Props {
  productDetail: ProductDetailForAdminResponse | null
  listViolation: ProductViolationHistory[] | null
  queryKey: string
}

export default function ButtonViewHistory({ productDetail, listViolation, queryKey }: Props) {
  const currentViolation = listViolation?.find((item) => !item.isRepaired)
  const queryClient = useQueryClient()

  const deleteReportViolation = useMutation({
    mutationFn: violationApi.deleteReportViolation,
    onSuccess(deleteRes) {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
      toast.success(deleteRes.data.message)
      window.location.reload()
    }
  })

  const handleRevocationOfViolations = (close: () => void) => {
    if (productDetail) {
      deleteReportViolation.mutate(productDetail?.id)
      close()
    }
  }

  return (
    <ButtonModal
      nameButton='View history'
      title='History of violations'
      size={1100}
      className='text-md text-blue'
      isButtonSubmit={false}
    >
      <div className='flex flex-col gap-4 h-auto'>
        <div className='flex items-center justify-between text-[#999999] col-span-5 my-3'>
          <div className='flex w-1/2 justify-start gap-2 text-[#999999] col-span-5'>
            <div className='w-14 h-14'>
              <img
                className='w-full h-full object-cover'
                src={`${config.awsURL}products/${productDetail?.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                alt={productDetail?.name}
              />
            </div>
            <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
              <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{productDetail?.name}</div>
              <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {productDetail?.id}</div>
            </div>
          </div>
          <ButtonModal
            nameButton='Revocation of violations'
            title='Are you sure you want to revoke a violation order?'
            size={500}
            className='px-4 py-2 h-10 rounded-md text-sm font-normal bg-[#DC3545] text-white'
            handleSubmit={handleRevocationOfViolations}
          >
            <div className='mb-3'>
              The product will revert to its previous state ({currentViolation?.id}) after the violation order is
              revoked
            </div>
          </ButtonModal>
        </div>

        <div className='border-[1px] border-gray-200 rounded-md overflow-hidden mb-3'>
          <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
            <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
              <div className='flex justify-start text-[#999999] col-span-3'>Violation type</div>
              <div className='flex justify-start text-[#999999] col-span-4'>Violation reason</div>
              <div className='flex justify-start text-[#999999] col-span-3'>Suggestion</div>
              <div className='flex justify-start text-[#999999] col-span-1'>Updated on</div>
              <div className='flex justify-start text-[#999999] col-span-1'>Deadline</div>
            </div>
          </div>

          <div className=''>
            <div className='flex flex-col h-auto col-span-2 rounded-sm overflow-hidden'>
              {listViolation &&
                listViolation?.map((item, index) => (
                  <div
                    key={index}
                    className={`${item.isRepaired ? 'border-b-2' : 'border border-[#fce2e4] bg-[#f8926b]'}`}
                  >
                    <div className='px-6 py-3 flex-1 grid grid-cols-12 items-start'>
                      <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                        {item.typeViolation.title}
                      </div>
                      <div className='flex justify-start col-span-4 text-[#333333] text-sm'>{item.reasons}</div>
                      <div className='flex justify-start col-span-3 text-[#333333] text-sm'>{item.suggest}</div>
                      <div className='flex justify-start col-span-1 text-[#333333] text-sm'>
                        {formatDateTime(item.createdAt)}
                      </div>
                      <div className='flex justify-start col-span-1 text-[#333333] text-sm'>
                        {formatDateTime(item.deadline)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </ButtonModal>
  )
}
