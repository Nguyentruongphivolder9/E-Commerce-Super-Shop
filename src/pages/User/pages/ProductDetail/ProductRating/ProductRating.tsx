import { Pagination } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import ratingApi from 'src/apis/rating.api'
import ProductRatingStar from 'src/components/ProductRatingStar'
import config from 'src/constants/config'
import { sortBy } from 'src/constants/product'
import { RatingForUserResponse } from 'src/types/rating.type'
import { ParamsConfig } from 'src/types/utils.type'
import { formatDateTime, generateURLAvatar } from 'src/utils/utils'

interface Props {
  productId: string
}

const params: ParamsConfig = {
  page: 1,
  limit: 5
}

export default function ProductRating({ productId }: Props) {
  const [queryConfig, setQueryConfig] = useState<ParamsConfig>(params)
  const [listRatings, setListRatings] = useState<RatingForUserResponse[]>([])
  const { data: ratingFigureData } = useQuery({
    queryKey: ['getRatingFigureByProductIdForUser'],
    queryFn: () => ratingApi.getRatingFigureByProductIdForUser(productId),
    enabled: false
  })
  const { data: listRatingsData, refetch } = useQuery({
    queryKey: ['getListRatingsByProductIdForUser', queryConfig],
    queryFn: () => ratingApi.getListRatingsByProductIdForUser(queryConfig, productId),
    enabled: false
  })
  const ratingFigure = ratingFigureData?.data.body
  const totalPages = listRatingsData?.data.body?.totalPages

  const toggleVoteUseFullMutation = useMutation({
    mutationFn: ratingApi.toggleVoteUseFull
  })

  useEffect(() => {
    if (listRatingsData?.data.body) {
      setListRatings(listRatingsData?.data.body.listRatings)
    }
  }, [listRatingsData])

  useEffect(() => {
    refetch()
  }, [queryConfig, refetch])

  const handleRatingFilterClick = (rating: string | undefined) => {
    setQueryConfig((prevConfig) => ({
      ...prevConfig,
      rating_filter: rating,
      sort_by: undefined,
      page: 1
    }))
  }

  const handleSortByClick = (option: string | undefined) => {
    switch (option) {
      case sortBy.withComment:
        setQueryConfig((prevConfig) => ({
          ...prevConfig,
          sort_by: option,
          rating_filter: undefined,
          page: 1
        }))
        break
      case sortBy.withPhoto:
        setQueryConfig((prevConfig) => ({
          ...prevConfig,
          sort_by: option,
          page: 1
        }))
        break

      default:
        break
    }
  }

  const handlePageChange = (page: number) => {
    setQueryConfig((prevConfig) => ({
      ...prevConfig,
      page
    }))
  }

  const handleToggleVoteUseFull = async (ratingId: string) => {
    try {
      const response = await toggleVoteUseFullMutation.mutateAsync(ratingId)
      if (response.data.statusCode === 200) {
        setListRatings((prevRatings) =>
          prevRatings.map((rating) =>
            rating.id === ratingId
              ? {
                  ...rating,
                  isVoteUseFull: !rating.isVoteUseFull,
                  countVote: !rating.isVoteUseFull ? rating.countVote + 1 : rating.countVote - 1
                }
              : rating
          )
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-white mt-4 shadow'>
      <div className='px-6 pt-6 mb-4'>
        <div className='rounded text-lg pb-3 capitalize text-[#000000DE]'>Product Ratings</div>
        <div className='flex items-center mb-4 p-7 min-h-20 rounded-sm border-[1px] border-[#f9ede5] bg-[#fffbf8]'>
          <div className='mr-7'>
            <div className='flex items-end gap-2'>
              <div className='text-3xl text-blue'>4.9</div>
              <div className='text-lg text-blue'>out of 5</div>
            </div>
            <div className='h-fit mt-2'>
              <ProductRatingStar
                // rating={product.rating}
                rating={4.9}
                activeClassName='h-6 w-6 text-[#ffa727] fill-[#ffa727]'
                nonActiveClassName='h-6 w-6 text-gray-300 fill-gray-300'
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='flex flex-wrap'>
              <button
                onClick={() => handleRatingFilterClick(undefined)}
                className={`${queryConfig.rating_filter === undefined && queryConfig.sort_by === undefined ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                All
              </button>
              <button
                onClick={() => handleRatingFilterClick('5')}
                className={`${queryConfig.rating_filter === '5' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                5 star ({ratingFigure?.start5})
              </button>
              <button
                onClick={() => handleRatingFilterClick('4')}
                className={`${queryConfig.rating_filter === '4' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                4 star ({ratingFigure?.start4})
              </button>
              <button
                onClick={() => handleRatingFilterClick('3')}
                className={`${queryConfig.rating_filter === '3' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                3 star ({ratingFigure?.start3})
              </button>
              <button
                onClick={() => handleRatingFilterClick('2')}
                className={`${queryConfig.rating_filter === '2' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                2 star ({ratingFigure?.start2})
              </button>
              <button
                onClick={() => handleRatingFilterClick('1')}
                className={`${queryConfig.rating_filter === '1' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                1 star ({ratingFigure?.start1})
              </button>
              <button
                onClick={() => handleSortByClick('withComment')}
                className={`${queryConfig.sort_by === 'withComment' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                with comments ({ratingFigure?.withComment})
              </button>
              <button
                onClick={() => handleSortByClick('withPhoto')}
                className={`${queryConfig.sort_by === 'withPhoto' ? 'border-blue text-blue' : 'border-[#333333] text-[#333333]'} my-[5px] mr-2 flex items-end justify-center capitalize min-w-28 p-2 border-[1px] rounded-sm text-sm bg-white`}
              >
                with photo ({ratingFigure?.withPhoto})
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className='px-6 pb-6'>
        <div className=''>
          {listRatings &&
            listRatings.map((item, index) => (
              <div key={index} className='flex items-start pl-5 py-4 border-b-[1px]'>
                <div className='mr-2'>
                  {item.account.avatarUrl ? (
                    <div className='h-10 w-10 rounded-full bg-[#F5F5F5] flex items-center justify-center'>
                      <img
                        src={generateURLAvatar(item.account.avatarUrl)}
                        alt='avatar'
                        className='w-full h-full rounded-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-[#F5F5F5] flex items-center justify-center'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='size-6 text-[#999999]'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className='flex-1 flex flex-col justify-start'>
                  <div className='text-xs text-[#000000DE] h-fit'>{item.account.userName}</div>
                  <div className='mt-1'>
                    <ProductRatingStar
                      rating={item.ratingStar}
                      activeClassName='h-4 w-4 text-[#ffa727] fill-[#ffa727]'
                      nonActiveClassName='h-4 w-4 text-gray-300 fill-gray-300'
                    />
                  </div>
                  <div className='flex gap-2 mt-1 mb-4 text-xs text-[#0000008A] h-fit'>
                    <span>{formatDateTime(item.createdAt)}</span>
                    {item.variantName && (
                      <div className='flex gap-2'>
                        <div className='h-auto w-[1px] flex items-center'>
                          <div className='h-5/6 w-full bg-[#0000008A]'></div>
                        </div>
                        <span>Variation: {item.variantName}</span>
                      </div>
                    )}
                  </div>
                  {item.trueDescription && (
                    <div className='text-sm mb-1'>
                      <span className='text-[#00000066]'>Accurate description: </span>
                      <span className='text-[#000000DE]'>{item.trueDescription}</span>
                    </div>
                  )}
                  {item.productQuality && (
                    <div className='text-sm'>
                      <span className='text-[#00000066]'>Product quality: </span>
                      <span className='text-[#000000DE]'>{item.productQuality}</span>
                    </div>
                  )}

                  {item.comment && <div className='mt-3 text-sm text-[#000000DE]'>{item.comment}</div>}
                  {item.feedbackImages.length > 0 && (
                    <div className='mt-4'>
                      <div className='flex flex-wrap'>
                        {item.feedbackImages.map((item, indexImg) => (
                          <div key={indexImg} className='h-[72px] w-[72px] mr-2 mb-2'>
                            <img
                              className='object-cover h-full w-full'
                              src={`${config.awsURL}products/${item.imageUrl}`}
                              alt='feedback'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.sellerFeedback && (
                    <div className='bg-[#f5f5f5] p-3 text-sm'>
                      <div className='text-[#000000DE]'>Seller&rsquo;s Response:</div>
                      <div className='text-[#000000A6] mt-2'>{item.sellerFeedback.message}</div>
                    </div>
                  )}
                  <div className='mt-5'>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => handleToggleVoteUseFull(item.id)} type='button'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className={`size-5 ${item.isVoteUseFull ? 'text-blue' : 'text-[#00000066]'}`}
                        >
                          <path d='M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z' />
                        </svg>
                      </button>
                      <div className='text-[#00000066]'>{item.countVote > 0 ? item.countVote : 'Helpful?'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className='mt-5 flex justify-center'>
            <Pagination
              onChange={handlePageChange}
              total={Number(totalPages)}
              siblings={1}
              defaultValue={queryConfig.page ? Number.parseInt(queryConfig.page.toString()) : 1}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
