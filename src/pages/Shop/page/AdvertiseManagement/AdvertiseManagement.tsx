import React, { useEffect, useState } from 'react'
import advertiseApi from 'src/apis/advertise.api'
import { AdvertiseResponse } from 'src/types/advertise.type'
import config from 'src/constants/config'
import { NavLink } from 'react-router-dom'
import path from 'src/constants/path'

const BASE_URL = config.awsURL

const AdvertiseList = () => {
  const [advertises, setAdvertises] = useState<AdvertiseResponse[]>([])
  const [filteredAdvertises, setFilteredAdvertises] = useState<AdvertiseResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)
  const [year, setYear] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [paymentFilter, setPaymentFilter] = useState<boolean | null>(null)
  const [runFilter, setRunFilter] = useState<boolean | null>(null)

  const calculateRemainingTime = (endDate: string, isRun: boolean) => {
    if (!isRun) {
      return null
    }

    const now = new Date()
    const end = new Date(endDate)
    const timeDiff = end.getTime() - now.getTime()

    if (timeDiff <= 0) {
      return 'Expired'
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

    // Show only minutes if time remaining is less than 1 hour
    if (days === 0 && hours === 0) {
      return `${minutes}m`
    }

    return `${days}d ${hours}h ${minutes}m`
  }

  const applyFilters = () => {
    let filtered = advertises

    if (month && year) {
      filtered = filtered.filter((ad) => {
        const adStartDate = new Date(ad.startDate)
        return adStartDate.getMonth() + 1 === Number(month) && adStartDate.getFullYear() === Number(year)
      })
    }

    if (statusFilter) {
      filtered = filtered.filter((ad) => ad.status === statusFilter)
    }

    if (paymentFilter !== null) {
      filtered = filtered.filter((ad) => ad.payed === paymentFilter)
    }

    if (runFilter !== null) {
      filtered = filtered.filter((ad) => ad.run === runFilter) // Filtering for run status
    }

    setFilteredAdvertises(filtered)
  }

  useEffect(() => {
    const fetchAdvertises = async () => {
      try {
        const response = await advertiseApi.getAllAdvertiseOfShop()
        if (response.data && response.data.body) {
          setAdvertises(response.data.body)
          setFilteredAdvertises(response.data.body) // Show all ads initially
        } else {
          setAdvertises([])
          setFilteredAdvertises([]) // No data available
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Error fetching data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchAdvertises()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [month, year, statusFilter, paymentFilter, runFilter])

  if (loading) return <div className='text-center mt-8'>Loading...</div>
  if (error) return <div className='text-center mt-8 text-red-600'>{error}</div>

  return (
    <div>
      <div className='flex flex-wrap lg:flex-nowrap'>
        <div className='relative border border-black isolate overflow-hidden bg-white rounded-lg py-4  w-full mr-2'>
          <div className='px-4 lg:px-16'>
            <div className='flex justify-between'>
              <h2 className='text-3xl font-bold tracking-tight text-blue'>ShopChannel Ads</h2>
              <div className='flex items-center'>
                <NavLink
                  to={'/shopchannel/portal/advertise/new'}
                  className='p-2 px-2 mr-2 bg-blue text-white font-semibold rounded-full shadow-md hover:bg-blue-300 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-75'
                >
                  Create New AD
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-8xl mx-auto mt-8'>
        <div className='flex items-center justify-between px-6 mb-4'>
          <div className='text-3xl text-[#333333] font-bold'>Advertise Management</div>
          <div className='flex space-x-4'>
            <select value={month || ''} onChange={(e) => setMonth(e.target.value)}>
              <option value=''>Month</option>
              <option value='1'>January</option>
              <option value='2'>February</option>
              <option value='3'>March</option>
              <option value='4'>April</option>
              <option value='5'>May</option>
              <option value='6'>June</option>
              <option value='7'>July</option>
              <option value='8'>August</option>
              <option value='9'>September</option>
              <option value='10'>October</option>
              <option value='11'>November</option>
              <option value='12'>December</option>
            </select>

            <select value={year || ''} onChange={(e) => setYear(e.target.value)}>
              <option value=''>Year</option>
              <option value='2023'>2023</option>
              <option value='2024'>2024</option>
              <option value='2025'>2025</option>
            </select>
            <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value=''>Status</option>
              <option value='Accepted'>Accepted</option>
              <option value='Wait Accept'>Wait Accept</option>
              <option value='Running'>Running</option>
              <option value='Complete'>Complete</option>
              <option value='Pending Payment'>Pending Payment</option>
            </select>
            <select
              value={paymentFilter === null ? '' : paymentFilter ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  setPaymentFilter(null) // Show both paid and unpaid
                } else {
                  setPaymentFilter(value === 'true') // Set filter based on selection
                }
              }}
            >
              <option value=''>Payment Status</option>
              <option value='true'>Paid</option>
              <option value='false'>Unpaid</option>
            </select>

            {/* Run Filter */}
            {/* <select
              value={runFilter === null ? '' : runFilter ? 'true' : 'false'}
              onChange={(e) => {
                const value = e.target.value
                setRunFilter(value === '' ? null : value === 'true')
              }}
            >
              <option value=''>Process</option>
              <option value='true'>Run</option>
              <option value='false'>Not Run</option>
            </select> */}

            <NavLink to={path.shopDeletedAdvertise}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-8 text-red-600'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z'
                />
              </svg>
            </NavLink>
          </div>
        </div>
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
                {/* <th className='py-2 px-4 border-b'>Process</th> */}
                <th className='py-2 px-4 border-b'>Remaining Time</th>
                <th className='py-2 px-4 border-b'>Clicks</th>
                <th className='py-2 px-4 border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvertises.length > 0 ? (
                filteredAdvertises.map((ad, index) => (
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
                    {/* <td className='py-2 px-4 border-b text-center'>{ad.run ? 'Run' : 'Not Run'}</td> */}
                    <td className='py-2 px-4 border-b text-center'>
                      {calculateRemainingTime(ad.endDate, ad.run) || ''}
                    </td>
                    <td className='py-2 px-4 border-b text-center'>
                      <NavLink to={`${path.shopDetailAdvertise.replace(':id', ad.id)}`}>
                        <button className='px-3 py-1 rounded-lg bg-[#5a6268] text-white hover:bg-[#55585b]'>
                          View
                        </button>
                      </NavLink>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className='py-2 px-4 border-b text-center'>
                    Nothing
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdvertiseList
