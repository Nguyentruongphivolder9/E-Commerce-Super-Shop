import { useEffect, useState } from 'react'
import advertiseApi from 'src/apis/advertise.api'
import config from 'src/constants/config'
import { AdvertiseResponse } from 'src/types/advertise.type'

const BASE_URL = config.awsURL

const DeletedAdvertises = () => {
  const [advertises, setAdvertises] = useState<AdvertiseResponse[]>([])

  useEffect(() => {
    const fetchAdvertises = async () => {
      try {
        const response = await advertiseApi.getDeletedAdvertises()
        if (response.data && response.data.body) {
          setAdvertises(response.data.body)
          console.log(response.data.body)
        } else {
          setAdvertises([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchAdvertises()
  }, [])

  return (
    <div>
      <h1 className='text-2xl font-semibold mb-4'>Deleted Advertisements</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>No</th>
              <th className='py-2 px-4 border-b'>Title</th>
              <th className='py-2 px-4 border-b'>Start Date</th>
              <th className='py-2 px-4 border-b'>End Date</th>
              <th className='py-2 px-4 border-b'>Cost per hour</th>
              <th className='py-2 px-4 border-b'>Images</th>
              <th className='py-2 px-4 border-b'>Status</th>
              <th className='py-2 px-4 border-b'>Payed</th>
            </tr>
          </thead>
          <tbody>
            {advertises.length > 0 ? (
              advertises.map((ad, index) => (
                <tr key={ad.id}>
                  <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                  <td className='py-2 px-4 border-b text-center'>{ad.title}</td>
                  <td className='py-2 px-4 border-b text-center'>{ad.startDate}</td>
                  <td className='py-2 px-4 border-b text-center'>{ad.endDate}</td>
                  <td className='py-2 px-4 border-b text-center'>{ad.esBanner}</td>
                  <td className='py-2 px-4 border-b text-center'>
                    {ad.advertiseImages.length > 0 ? (
                      ad.advertiseImages.map((img) => (
                        <div key={img.id} className='inline-block mr-2'>
                          <img
                            src={`${BASE_URL}advertises/${img.imageUrl}`}
                            alt='Advertise'
                            className='w-48 h-16 object-cover rounded'
                          />
                        </div>
                      ))
                    ) : (
                      <div>No images</div>
                    )}
                  </td>
                  <td className='py-2 px-4 border-b text-center'>{ad.status}</td>
                  <td className='py-2 px-4 border-b text-center'>
                    {ad.payed ? (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6 text-green-600'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6 text-red-700'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                      </svg>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className='py-2 px-4 border-b text-center'>
                  No advertisements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DeletedAdvertises
