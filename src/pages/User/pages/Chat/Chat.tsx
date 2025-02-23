import { useEffect, useRef, useState } from 'react'
import { Transition, Paper, Button, Box, Input, ScrollArea, Popover, Switch } from '@mantine/core'
import { IconChevronDown, IconChevronRight, IconMessageFilled, IconSearch } from '@tabler/icons-react'
import HeaderChat from './HeaderChat'
import InputChat from './InputChat'
import ConversationContent from './ConversationContent'
import ItemConversation from './ItemConversation'

const scaleY = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0)' },
  common: { transformOrigin: 'bottom left' },
  transitionProperty: 'transform, opacity'
}
export default function Chat() {
  const [opened, setOpened] = useState(false)
  const [popoverOpened, setPopoverOpened] = useState(false)
  const clickOutsideRef = useRef<HTMLDivElement | null>(null)
  const popoverDropdownRef = useRef<HTMLDivElement | null>(null)
  const popoverTargetRef = useRef<HTMLDivElement | null>(null)
  const [recipientId, setRecipientId] = useState<string | null>(null)

  const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node
    if (!clickOutsideRef.current?.contains(target) && !popoverDropdownRef.current?.contains(target)) {
      setOpened(false)
      setPopoverOpened(false)
    } else if (!popoverDropdownRef.current?.contains(target) && !popoverTargetRef.current?.contains(target)) {
      setPopoverOpened(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [])

  return (
    <Box className='bottom-4 left-4' maw={200} pos='fixed'>
      <Button className={`flex ${opened && 'hidden'}`} onClick={() => setOpened(true)}>
        <IconMessageFilled />
        <span className='ml-2 text-lg'>Chat</span>
      </Button>
      <Transition mounted={opened} transition={scaleY} duration={200} timingFunction='ease' keepMounted>
        {(transitionStyle) => (
          <Paper
            shadow='none'
            p='none'
            h={500}
            w={700}
            pos='absolute'
            bottom={0}
            left={0}
            withBorder={true}
            ref={clickOutsideRef}
            style={{ ...transitionStyle, zIndex: 40 }}
          >
            <div className='w-full h-full flex flex-col'>
              {/* header */}
              <HeaderChat />

              {/* conversation */}
              <div className='h-[460px] flex w-full'>
                <div className='flex-1 h-full flex flex-col border-r-[1px]'>
                  {/* input search */}
                  <div className='py-2 px-3 h-12 flex items-center gap-3'>
                    <Input className='flex-1' size='xs' placeholder='Search' leftSection={<IconSearch size={16} />} />
                    <div className='flex gap-1 items-center'>
                      <span className='text-dart-3 text-sm'>Tất cả</span>
                      <IconChevronDown className='text-light-3' width={'20'} stroke={1.5} />
                    </div>
                  </div>

                  {/* list conversation */}
                  <div className='flex-1 h-full overflow-hidden'>
                    <ScrollArea className='h-full' scrollbarSize={8}>
                      <ul className='h-full'>
                        <li>
                          <ItemConversation />
                        </li>
                      </ul>
                    </ScrollArea>
                  </div>
                </div>
                <div className='w-[470px] h-full'>
                  <div className='h-[40px] px-4 flex items-center border-b-[1px]'>
                    <Popover width={215} opened={popoverOpened} position='bottom-start' offset={1} withinPortal>
                      <Popover.Target>
                        <div
                          ref={popoverTargetRef}
                          onClick={() => setPopoverOpened((prev) => !prev)}
                          className='flex gap-1 items-center cursor-pointer'
                        >
                          <span className='text-sm text-dark-3 font-semibold noSelect'>pon.mens1</span>
                          <IconChevronDown className='text-light-3' width={'18'} stroke={1.5} />
                        </div>
                      </Popover.Target>
                      <Popover.Dropdown ref={popoverDropdownRef} className='shadow-md'>
                        <div className='flex items-center pb-3 gap-2 border-b-[2px]'>
                          <div className='h-8 w-8'>
                            <img
                              className='h-full w-full rounded-full object-cover'
                              src='https://cf.shopee.vn/file/260ea0bdbbe75bc879063af3336f1823_tn'
                              alt='avatar'
                            />
                          </div>
                          <div className='text-sm text-dark-3 line-clamp-1'>pon.mens1</div>
                        </div>
                        <div className='py-2 w-full'>
                          <div className='flex justify-between items-center py-2'>
                            <div className='text-dark-3 text-xs'>Tắt thông báo</div>
                            <Switch defaultChecked size='xs' />
                          </div>
                          <div className='flex justify-between items-center py-2'>
                            <div className='text-dark-3 text-xs'>Chặn người dùng</div>
                            <Switch defaultChecked size='xs' />
                          </div>
                        </div>
                        <div className='border-t-[1px]'>
                          <div className='text-xs text-dark-3 flex py-2 justify-between items-center'>
                            <span className=''>Xem thông tin cá nhân</span>
                            <IconChevronRight className='text-light-3' width={'18'} stroke={1.5} />
                          </div>
                        </div>
                      </Popover.Dropdown>
                    </Popover>
                  </div>
                  <div className='h-[332px] bg-stone-100'>
                    <ConversationContent recipientId={recipientId} />
                  </div>
                  <div className='h-[88px] border-t-[1px]'>
                    <InputChat />
                  </div>
                </div>
              </div>
            </div>
          </Paper>
        )}
      </Transition>
    </Box>
  )
}
