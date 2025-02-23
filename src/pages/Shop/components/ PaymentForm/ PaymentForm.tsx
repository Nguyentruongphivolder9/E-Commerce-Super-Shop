import React from 'react'

interface PaymentFormProps {
  totalAmount: number
  onPaymentSubmit: (cardNumber: string, expiryDate: string, cvv: string) => void
}

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, onPaymentSubmit }) => {
  const [cardNumber, setCardNumber] = React.useState('')
  const [expiryDate, setExpiryDate] = React.useState('')
  const [cvv, setCvv] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onPaymentSubmit(cardNumber, expiryDate, cvv)
  }

  return (
    <div className='max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-semibold mb-4'>Payment</h2>
      <p className='mb-6'>
        Total Estimated Cost : <span className='font-bold'>{totalAmount}₫</span>
      </p>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='cardNumber'>
            Card Number:
          </label>
          <input
            type='text'
            id='cardNumber'
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='1234 5678 9012 3456'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='expiryDate'>
            Expiry Date
          </label>
          <input
            type='text'
            id='expiryDate'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='MM/YY'
            required
          />
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700' htmlFor='cvv'>
            CVV
          </label>
          <input
            type='text'
            id='cvv'
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='123'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Pay
        </button>
      </form>
    </div>
  )
}

export default PaymentForm
