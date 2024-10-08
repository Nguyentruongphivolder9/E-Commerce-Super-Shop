import { Button, Loader, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Cell, Row } from '@tanstack/react-table'
import { createSearchParams, Link } from 'react-router-dom'
import path from 'src/constants/path'
import { VoucherRequest, VoucherResponse } from 'src/types/voucher.type'
import { StatusVoucher } from '../../../enums/voucherInfo.enum'
import voucherApi from 'src/apis/voucher.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import omit from 'lodash/omit'
export default function ActionsCell({
  cell,
  row
}: {
  cell: Cell<VoucherResponse, unknown>
  row: Row<VoucherResponse>
}) {
  const [opened, handlers] = useDisclosure(false)
  const rowData = row.original
  const queryClient = useQueryClient()

  const deleteMutaion = useMutation({
    mutationFn: (id: string) => voucherApi.deleteVoucher(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      handlers.close()
    }
  })

  const updateMutaion = useMutation({
    mutationFn: ({ id, body }: { id: string; body: VoucherRequest }) => voucherApi.updateVoucher({ id, body }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      handlers.close()
    }
  })

  const handleUpdate = async () => {
    try {
      if (rowData.status === StatusVoucher.ONGOING) {
        await updateMutaion.mutateAsync({
          id: row.original.id,
          body: {
            ...omit({ ...rowData, isEnd: true }, ['shopId', 'status'])
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    console.log()
    try {
      await deleteMutaion.mutateAsync(row.original.id)
      deleteMutaion.isSuccess && handlers.close()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Modal opened={opened} onClose={handlers.close} withCloseButton={false} centered size={400}>
        {rowData.status === StatusVoucher.ONGOING ? (
          <>
            <div className='p-2'>
              <h2 className='text-lg mb-5'>End Voucher</h2>
              <p className='text-sm text-gray-600'>Are you sure to end this voucher?</p>
            </div>
            <div className='flex gap-x-2 justify-end mt-6'>
              <Button
                onClick={handlers.close}
                className='border border-gray-500 text-gray-500 bg-white hover:bg-[#eee] hover:text-gray-500 text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] font-normal'
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className={` text-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] font-normal ${updateMutaion.isPending ? 'bg-blue/80' : 'bg-blue'}`}
                disabled={updateMutaion.isPending}
              >
                End
                {updateMutaion.isPending ? <Loader color='white' size={17} mr={8} /> : ''}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className='p-2'>
              <h2 className='text-lg mb-5'>Delete voucher</h2>
              <p className='text-sm text-gray-600'>Are you sure to delete this voucher?</p>
            </div>
            <div className='flex gap-x-2 justify-end mt-6'>
              <Button
                onClick={handlers.close}
                className='border border-gray-500 text-gray-500 bg-white hover:bg-[#eee] hover:text-gray-500 text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] font-normal'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className={`text-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] font-normal ${deleteMutaion.isPending ? 'bg-blue/80' : 'bg-blue'}`}
                disabled={deleteMutaion.isPending}
              >
                {deleteMutaion.isPending ? <Loader color='white' size={17} mr={8} /> : ''}
                Delete
              </Button>
            </div>
          </>
        )}
      </Modal>

      <div className='flex flex-col text-blue'>
        {(rowData.status == 'ongoing' || rowData.status == 'upcoming') && (
          <Link to={`${path.voucherShopEdit}?${createSearchParams({ edit: rowData.id })}`}>Edit</Link>
        )}
        <Link to={''}>Orders</Link>
        {rowData.status == 'expire' && <Link to={''}>Details</Link>}
        {rowData.status == 'ongoing' && <div onClick={handlers.open}>End</div>}
        {rowData.status == 'upcoming' && <div onClick={handlers.open}>Delete</div>}
      </div>
    </>
  )
}
