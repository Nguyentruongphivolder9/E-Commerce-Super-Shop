import React from 'react'

export default function ContainerModal({ children }: { children: React.ReactNode }) {
  return (
    <div className='z-50 bottom-0 top-0 left-0 right-0 fixed overflow-hidden bg-[#00000066]'>
      <div className='absolute top-10 bottom-10 left-0 right-0 flex justify-center items-center'>
        <div className='h-auto flex'>{children}</div>
      </div>
    </div>
  )
}
