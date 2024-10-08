import { motion } from 'framer-motion'

interface Props {
  text: string
  selected: boolean
  setSelected: (value: string) => void
}

const Chip = ({ text, selected, setSelected }: Props) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected ? 'text-[#fff]' : 'text-[#27272A] hover:bg-gray-200'
      } text-sm transition-colors px-4 py-2 rounded-full relative border-[1px] border-solid border-gray-300`}
    >
      <span className='relative z-10'>{text}</span>
      {selected && (
        <motion.span
          layoutId='pill-tab'
          transition={{ duration: 0.3 }}
          className='absolute inset-0 z-0 bg-gradient-to-r rounded-full from-sky-400 to-sky-500'
        ></motion.span>
      )}
    </button>
  )
}

export default Chip
