import { Flex, Spoiler, Text, Timeline } from '@mantine/core'
import { parseISO, format } from 'date-fns'
import { useState } from 'react'

export default function StyledSteppperTimeLinePurchase() {
  const [active, setActive] = useState(1)
  const [expanded, setExpanded] = useState(false)
  return (
    <Spoiler
      maxHeight={150}
      showLabel='Show more'
      hideLabel='Hide details'
      expanded={expanded}
      onExpandedChange={setExpanded}
      styles={{
        control: {
          fontSize: '14px',
          marginLeft: '165px'
        }
      }}
    >
      <Timeline style={{ marginBottom: 10 }} active={1} bulletSize={20} lineWidth={2} reverseActive>
        <Timeline.Item>
          <div className='flex items-center gap-x-5'>
            <span>{format(parseISO('2024-08-30T21:32:40.144819'), 'dd-MM-yyyy HH:mm')}</span>
            <div className='text-[#26aa99] font-bold'>Đã giao</div>
          </div>
        </Timeline.Item>

        <Timeline.Item>
          <div className='flex items-center gap-x-5'>
            <span>{format(parseISO('2024-08-30T21:32:40.144819'), 'dd-MM-yyyy HH:mm')}</span>
            <div className='text-[#26aa99] font-bold'>Đã giao</div>
          </div>
        </Timeline.Item>

        <Timeline.Item>
          <div className='flex items-center gap-x-5'>
            <span>{format(parseISO('2024-08-30T21:32:40.144819'), 'dd-MM-yyyy HH:mm')}</span>
            <div className='text-[#26aa99] font-bold'>Đã giao</div>
          </div>
        </Timeline.Item>
        <Timeline.Item>
          <div className='flex items-center gap-x-5'>
            <span>{format(parseISO('2024-08-30T21:32:40.144819'), 'dd-MM-yyyy HH:mm')}</span>
            <div className='text-[#26aa99] font-bold'>Đã giao</div>
          </div>
        </Timeline.Item>
      </Timeline>
    </Spoiler>
  )
}
