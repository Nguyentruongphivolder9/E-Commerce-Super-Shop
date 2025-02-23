import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import config from 'src/constants/config'

interface Props {
  id: string
  imageUrl: string
  index: number
  deleteImage: (id: string, index: number) => void
}

export default function ImageItem({ id, imageUrl, index, deleteImage }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className='group w-24 h-24 relative border-dashed border-2 border-blue rounded-md overflow-hidden flex items-center'
    >
      <img
        {...listeners}
        className='object-cover h-full w-full cursor-move'
        src={`${config.awsURL}products/${imageUrl}`}
        alt={'upload file'}
      />
      <div className='absolute bottom-0 left-0 w-full h-6 bg-[#333333] hidden group-hover:grid group-hover:grid-cols-2 '>
        <div className='col-span-1'></div>
        <div className='col-span-1 items-center justify-center flex'>
          <button
            type='button'
            onClick={() => {
              deleteImage(id, index)
            }}
            className='w-fit h-fit'
          >
            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='#fff' viewBox='0 0 256 256'>
              <path d='M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z'></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
