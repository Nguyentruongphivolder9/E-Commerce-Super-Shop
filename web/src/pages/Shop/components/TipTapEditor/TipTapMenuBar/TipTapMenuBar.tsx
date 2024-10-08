import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

export default function TipTapMenuBar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className='w-full bg-gray-100 py-2 px-2'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`${
              editor.isActive('bold') ? 'is-active bg-gray-300' : ''
            } border font-bold text-md text-[#333333] h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow`}
            type='button'
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`${
              editor.isActive('italic') ? 'is-active bg-gray-300' : ''
            } border italic text-md font-bold text-[#333333] h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow`}
            type='button'
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`${
              editor.isActive('underline') ? 'is-active bg-gray-300' : ''
            } border underline text-md text-[#333333] font-bold h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow`}
            type='button'
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`${
              editor.isActive('strike') ? 'is-active bg-gray-300' : ''
            } border text-md text-[#333333] font-bold h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow`}
            type='button'
          >
            <svg
              className='icon w-5 h-5'
              width='24'
              height='24'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <g>
                <path fill='none' d='M0 0h24v24H0z'></path>
                <path d='M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z'></path>
              </g>
            </svg>
          </button>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            type='button'
            className='border h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.9}
              stroke='currentColor'
              className='size-4'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3' />
            </svg>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            type='button'
            className='border h-8 w-8 flex items-center justify-center border-gray-300 rounded-md shadow'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.9}
              stroke='currentColor'
              className='size-4'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
