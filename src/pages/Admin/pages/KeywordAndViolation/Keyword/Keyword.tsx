import { Checkbox, Select } from '@mantine/core'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import forbiddenKeywordApi from 'src/apis/forbiddenKeyword.api'
import Button from 'src/components/Button'
import LoadingContainer from 'src/components/LoadingContainer'
import NoData from 'src/components/NoData'
import { ForbiddenKeywordResponse } from 'src/types/forbiddenKeyword.type'
import { formatDateTime } from 'src/utils/utils'

interface ExtendedForbiddenKeyword extends ForbiddenKeywordResponse {
  disabled: boolean
  checked: boolean
}

export default function Keyword() {
  const queryClient = useQueryClient()
  const [valueKeyword, setValueKeyword] = useState('')
  const [keywordId, setKeywordId] = useState('')
  const [errorKeyword, setErrorKeyword] = useState('')
  const [limitElement, setLimitElement] = useState<number>(12)
  const [page, setPage] = useState<number>(1)
  const [extendedForbiddenKeyword, setExtendedForbiddenKeyword] = useState<ExtendedForbiddenKeyword[]>([])
  const [actionSubmit, setActionSubmit] = useState('create')

  const createForbiddenKeywordMutation = useMutation({
    mutationFn: forbiddenKeywordApi.addForbiddenKeyword
  })

  const editForbiddenKeywordMutation = useMutation({
    mutationFn: forbiddenKeywordApi.editForbiddenKeyword
  })

  const deleteListForbiddenKeywordsMutation = useMutation({
    mutationFn: forbiddenKeywordApi.deleteListForbiddenKeyword
  })

  const { data: forbiddenKeywordData, isLoading } = useQuery({
    queryKey: ['listForbiddenKeywords'],
    queryFn: () => forbiddenKeywordApi.getListForbiddenKeyword()
  })

  const location = useLocation()
  const chosenProductIdFromLocation = (location.state as { fkId: string } | null)?.fkId
  const forbiddenKeywords = forbiddenKeywordData?.data?.body
  const isAllChecked = useMemo(
    () => extendedForbiddenKeyword?.every((fKeyword) => fKeyword.checked),
    [extendedForbiddenKeyword]
  )
  const checkedProduct = useMemo(
    () => extendedForbiddenKeyword.filter((fKeyword) => fKeyword.checked),
    [extendedForbiddenKeyword]
  )
  const indeterminate = extendedForbiddenKeyword.some((value) => value.checked) && !isAllChecked
  const checkedProductCount = checkedProduct.length
  const totalPage = Math.ceil((forbiddenKeywordData?.data.body?.length ?? 0) / limitElement)

  useEffect(() => {
    setExtendedForbiddenKeyword((prev) => {
      const extendedProductObject = keyBy(prev, 'id')

      return (
        forbiddenKeywords?.slice(limitElement * (page - 1), limitElement * page).map((fKeyword) => {
          const isChosenProductIdFromLocation = chosenProductIdFromLocation === fKeyword.id
          return {
            ...fKeyword,
            disabled: false,
            checked: isChosenProductIdFromLocation || Boolean(extendedProductObject[fKeyword.id]?.checked)
          }
        }) || []
      )
    })
  }, [forbiddenKeywords, chosenProductIdFromLocation, page, limitElement])

  const handelSubmit = async () => {
    if (valueKeyword == '') {
      setErrorKeyword('Keywords must not be left blank.')
      return
    }

    if (valueKeyword.length < 2 || valueKeyword.length > 50) {
      setErrorKeyword('Keywords between 2 and 50 characters in length.')
      return
    }

    try {
      const formKeyword = {
        id: keywordId,
        keyword: valueKeyword
      }
      if (actionSubmit == 'create') {
        const createRes = await createForbiddenKeywordMutation.mutateAsync(formKeyword)
        if (createRes.data.statusCode === 201) {
          toast.success(createRes.data.message)
          setValueKeyword('')
        }
      } else {
        const createRes = await editForbiddenKeywordMutation.mutateAsync(formKeyword)
        if (createRes.data.statusCode === 200) {
          toast.success(createRes.data.message)
          setValueKeyword('')
          setKeywordId('')
          setActionSubmit('create')
        }
      }
      const filters: InvalidateQueryFilters = { queryKey: ['listForbiddenKeywords'] }
      queryClient.invalidateQueries(filters)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCheck = (ProductIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedForbiddenKeyword(
      produce((draft) => {
        draft[ProductIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedForbiddenKeyword((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    )
  }

  const handleDeleteListForbiddenKeyword = async () => {
    if (checkedProduct.length > 0) {
      try {
        const listString: string[] = checkedProduct.map((item) => item.id)
        const createRes = await deleteListForbiddenKeywordsMutation.mutateAsync(listString)
        if (createRes.data.statusCode === 200) {
          toast.success(createRes.data.message)
          const filters: InvalidateQueryFilters = { queryKey: ['listForbiddenKeywords'] }
          queryClient.invalidateQueries(filters)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleDeleteForbiddenKeyword = async (stringId: string) => {
    try {
      const listString: string[] = [stringId]
      const createRes = await deleteListForbiddenKeywordsMutation.mutateAsync(listString)
      if (createRes.data.statusCode === 200) {
        toast.success(createRes.data.message)
        const filters: InvalidateQueryFilters = { queryKey: ['listForbiddenKeywords'] }
        queryClient.invalidateQueries(filters)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='col-span-4 bg-white shadow rounded-md p-4'>
      <div className='text-xl mb-2'>Forbidden Keywords</div>
      <div className='flex items-start gap-4'>
        <div className='flex-1 flex-col justify-center items-center'>
          <div
            className={`px-5 w-full border h-9 rounded-md flex items-center p-1 ${errorKeyword ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
          >
            <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full'>
              <input
                type='text'
                maxLength={50}
                className='text-sm text-[#333333] w-full border-none outline-none pr-3'
                placeholder='keywords or short sentences'
                onChange={(e) => {
                  setValueKeyword(e.target.value)
                  setErrorKeyword('')
                }}
                value={valueKeyword}
              />
              <div className='text-sm text-[#999999]'>{valueKeyword.length}/50</div>
            </div>
          </div>
          <div className={`${errorKeyword ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}>
            {errorKeyword}
          </div>
        </div>
        <Button
          onClick={handelSubmit}
          className='text-blue text-sm h-9 w-16 border-[1px] rounded-sm border-blue hover:bg-sky-100'
        >
          {actionSubmit}
        </Button>
        <Button
          onClick={() => {
            setValueKeyword('')
            setKeywordId('')
            setActionSubmit('create')
          }}
          className='text-[#333333] hover:bg-slate-100 text-sm h-9 w-16 border-[1px] rounded-sm'
        >
          Reset
        </Button>
      </div>

      <div className='mt-2'>
        <div className='mb-4 flex flex-row items-center justify-between gap-2'>
          <div className='text-md text-[#333333]'>{forbiddenKeywordData?.data.body?.length} Keywords</div>
          <div className=''>
            <div className='flex items-center gap-3 justify-end'>
              <div className='flex items-center'>
                <div className='mr-2'>
                  {page == 1 ? (
                    <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                      {' '}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-3 h-3'
                      >
                        <path
                          fillRule='evenodd'
                          d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  ) : (
                    <button
                      onClick={() => setPage(page - 1)}
                      className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-3 h-3'
                      >
                        <path
                          fillRule='evenodd'
                          d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className='text-sm'>
                  <span className='text-blue'>{page}</span>
                  <span className='mx-2'>/</span>
                  <span>{totalPage}</span>
                </div>
                <div className='ml-2'>
                  {page == totalPage ? (
                    <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed  shadow'>
                      {' '}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-3 h-3'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  ) : (
                    <button
                      onClick={() => setPage(page + 1)}
                      className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-3 h-3'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-3 '>
                <Select
                  placeholder='Pick value'
                  data={[
                    { value: '12', label: '12 / page' },
                    { value: '24', label: '24 / page' },
                    { value: '48', label: '48 / page' }
                  ]}
                  defaultValue={limitElement.toString()}
                  style={{ color: '#999999' }}
                  className='w-28 font-medium'
                  onChange={(value) => {
                    setLimitElement(Number.parseInt(value!))
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
          <div className='flex w-7 items-center py-3 pr-2'>
            <Checkbox indeterminate={indeterminate} checked={isAllChecked} onChange={handleCheckAll} />
          </div>
          <div className='py-3 px-2 flex-1 grid grid-cols-8 items-center'>
            <div className='flex justify-start text-[#999999] col-span-5'>Keyword</div>
            <div className='flex justify-start col-span-3'>
              <div className='text-[#999999]'>Updated Time</div>
            </div>
          </div>
          <div className='flex items-center w-24 py-3 pl-2 pr-4 text-[#999999]'>Action</div>
        </div>
        {!isLoading ? (
          extendedForbiddenKeyword.length > 0 ? (
            extendedForbiddenKeyword.map((item, index) => (
              <div
                key={index}
                className='px-4 flex h-auto col-span-2 text-[#999999] text-sm rounded-sm overflow-hidden'
              >
                <div className='flex w-7 items-center py-3 pr-2'>
                  <Checkbox key={item.id} checked={item.checked} onChange={handleCheck(index)} />
                </div>
                <div className='py-3 px-2 flex-1 grid grid-cols-8 items-center'>
                  <div className='flex justify-start col-span-5'>{item.keyword}</div>
                  <div className='flex justify-start col-span-3'>{formatDateTime(item.updatedAt)}</div>
                </div>
                <div className='flex items-center gap-4 w-24 py-3 pl-2 pr-4'>
                  <button
                    onClick={() => {
                      setKeywordId(item.id)
                      setValueKeyword(item.keyword)
                      setActionSubmit('update')
                    }}
                    className='text-blue'
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteForbiddenKeyword(item.id)} className='text-blue'>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full h-96'>
              <NoData title='No data' />
            </div>
          )
        ) : (
          <LoadingContainer height={'h-72'} heightIcon='h-16' widthIcon='w-16' />
        )}
      </div>

      {checkedProductCount > 0 && (
        <div className='flex z-10 px-4 sticky bottom-0 border-t-[2px] flex-row justify-between items-center h-16'>
          <div className='flex gap-4 items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <Checkbox indeterminate={indeterminate} checked={isAllChecked} onChange={handleCheckAll} />
            </div>
            <div>Select All</div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-[#333333]'>{checkedProductCount} products selected</div>
            <Button
              className=' bg-red-500 text-sm px-5 py-[6px] flex items-center justify-center  rounded-md text-white hover:bg-red-600'
              type='button'
              onClick={handleDeleteListForbiddenKeyword}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
