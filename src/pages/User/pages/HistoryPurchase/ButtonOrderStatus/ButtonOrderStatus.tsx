import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { OrderActionStatus, OrderResponse, OrderStatus } from 'src/types/order.type'
import RatingModal from '../RatingModal'
import { useDisclosure } from '@mantine/hooks'
import CancelModal from '../CancelModal'

interface Props {
  status: OrderStatus
  order: OrderResponse
  statusTypeModal: OrderActionStatus
  setStatusTypeModal: Dispatch<SetStateAction<OrderActionStatus>>
}

export default function ButtonOrderStatus({ status, order, statusTypeModal, setStatusTypeModal }: Props) {
  const [opened, { open, close }] = useDisclosure(false)
  const handleClick = (modalType: OrderActionStatus) => {
    setStatusTypeModal(modalType)
    open()
  }

  const buttonConfig: Record<OrderStatus, JSX.Element | null> = {
    pending: (
      <button
        className='px-4 py-2 rounded-md bg-white-400 text-gray-700 border border-gray-200 hover:bg-gray-100'
        onClick={() => handleClick('cancel')}
      >
        Cancelled
      </button>
    ),
    confirmed: (
      <button
        className='px-4 py-2 rounded-md bg-white-400 text-gray-700 border border-gray-200 hover:bg-gray-100'
        onClick={() => handleClick('cancel')}
      >
        Cancelled
      </button>
    ),
    delivering: (
      <button
        className='px-4 py-2 rounded-md bg-sky-200 text-gray-700 border border-gray-200 hover:bg-sky-300'
        onClick={() => handleClick('contactSeller')}
      >
        Contact Seller
      </button>
    ),
    completed: (
      <>
        {!order.isRating && (
          <button
            className='px-4 py-2 rounded-md bg-sky-200 text-gray-700 border border-gray-200 hover:bg-sky-300'
            onClick={() => handleClick('rating')}
          >
            Rating
          </button>
        )}
        <Link
          to={path.purchaseRefund.split(':')[0] + `${order && order.id}`}
          className='px-4 py-2 rounded-md bg-red-500 text-white bg-[#ee4d2d]'
        >
          Request for Refund/Return
        </Link>
      </>
    ),
    cancelled: (
      <button
        className='px-4 py-2 rounded-md bg-sky-200 text-gray-700 border border-gray-200 hover:bg-sky-300'
        onClick={() => handleClick('contactSeller')}
      >
        Contact Seller
      </button>
    ),
    refunded: (
      <button
        className='px-4 py-2 rounded-md bg-sky-200 text-gray-700 border border-gray-200 hover:bg-sky-300'
        onClick={() => handleClick('contactSeller')}
      >
        Contact Seller
      </button>
    ),
    all: null
  }

  const renderModal = () => {
    switch (statusTypeModal) {
      case 'rating':
        return <RatingModal order={order} opened={opened} open={open} close={close} />
      case 'cancel':
        return <CancelModal order={order} opened={opened} open={open} close={close} />
      default:
        return null
    }
  }

  return (
    <>
      {buttonConfig[status]}
      {renderModal()}
    </>
  )
}
