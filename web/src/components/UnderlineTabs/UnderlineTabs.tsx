import classNames from 'classnames'
import { Dispatch, SetStateAction } from 'react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
interface Props {
  tabs: {
    url?: string
    label: string
    status?: string
  }[]
  selectedTab: string
  setSelectedTab: Dispatch<SetStateAction<string>>
  isSpacingEvenly?: boolean
}
export default function UnderlineTabs({ tabs, selectedTab, setSelectedTab, isSpacingEvenly }: Props) {
  return tabs.map((tab) => {
    return (
      <NavLink
        to={tab.url !== undefined ? tab.url : ''}
        className={({ isActive }) =>
          `relative flex ${isSpacingEvenly ? 'flex-1' : ''} items-center justify-center h-14 px-4 text-sm text-center capitalize ${
            isActive ? 'text-gray-800' : 'text-gray-900'
          }`
        }
        key={tab.label}
        onClick={() => setSelectedTab(tab.label)}
      >
        {tab.label}
        {tab.label === selectedTab ? (
          <motion.div
            className='absolute inset-x-0 bottom-[-1px] h-[2px] bg-blue'
            layoutId='underline'
            transition={{ duration: 0.3, ease: 'linear' }}
          ></motion.div>
        ) : null}
      </NavLink>
    )
  })
}
