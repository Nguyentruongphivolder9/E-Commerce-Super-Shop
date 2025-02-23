import { useState } from 'react'
import Chip from './Chip/Chip'

const tabs = ['Computer & Accessories', 'Home Appliances', 'Fashion Accessories', 'Books & Stationery']
interface Props {
  options?: string[]
}

const ChipTabs = ({ options = tabs }: Props) => {
  const [selected, setSelected] = useState(options[0])

  return (
    <div className='px-4 flex items-center flex-wrap gap-2'>
      {options.map((tab) => (
        <Chip text={tab} selected={selected === tab} setSelected={setSelected} key={tab} />
      ))}
    </div>
  )
}

export default ChipTabs
