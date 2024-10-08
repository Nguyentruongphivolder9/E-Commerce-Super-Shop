import { ColumnDef } from '@tanstack/react-table'
import { VoucherResponse } from 'src/types/voucher.type'
import { format, parseISO } from 'date-fns'
import ActionsCell from './Actions'
import PercentImg from '../../../images/percent.png'
import DollarImg from '../../../images/dollar_fixed.png'
import QuantityUpdaterCell from './QuantityUpdater'
import { StatusVoucher } from '../../../enums/voucherInfo.enum'

export const columnDef: ColumnDef<VoucherResponse>[] = [
  {
    accessorKey: 'code',
    header: 'Voucher Name | Code',
    cell: ({ cell, row }) => {
      return (
        <div className='flex'>
          <div className='w-[56px] h-[56px] mr-3'>
            {row.original.discountType === 'fixed' ? (
              <img className='w-full h-full' src={DollarImg} alt='' />
            ) : (
              <img className='w-full h-full' src={PercentImg} alt='' />
            )}
          </div>
          <div className=''>
            <div className='text-sm font-medium text-gray-900'>
              <span
                className={`${
                  row.original.status === StatusVoucher.ONGOING
                    ? 'bg-green-200 text-green-500'
                    : row.original.status === StatusVoucher.UPCOMING
                      ? 'bg-red-200 text-red-500'
                      : 'bg-gray-400 text-gray-200'
                } px-1 rounded-sm capitalize text-xs`}
              >
                {row.original.status}
              </span>
            </div>
            <div className='font-medium text-gray-900 text-sm'>{row.original.name}</div>
            <div className='text-gray-500 text-xs'>Voucher Code: {row.original.code}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'voucherType',
    header: 'Voucher Type'
  },
  {
    accessorKey: 'discountAmount',
    header: 'Discount Amount',
    cell: ({ row }) =>
      row.original.discountType === 'fixed' ? `${row.original.fixedAmount}` : `${row.original.percentageAmount}%OFF`
  },
  {
    accessorKey: 'quantity',
    header: 'Usage quantity',
    cell: QuantityUpdaterCell
  },
  {
    accessorKey: 'usage',
    header: 'Usage'
  },
  {
    id: 'date',
    header: 'Claiming Period',
    accessorFn: (row) =>
      `${format(parseISO(row.startDate), 'dd/MM/yyyy, HH:mm')} - ${format(parseISO(row.endDate), 'dd/MM/yyyy, HH:mm')}`
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ActionsCell
  }
]
