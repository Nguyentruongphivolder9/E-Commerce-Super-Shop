import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

interface Props {
  tabs: {
    url: string
    label: string
  }[]
  selectedTab: string
}
export default function NavLinkUnderlineTabs({ tabs, selectedTab }: Props) {
  return tabs.map((tab) => {
    return (
      <NavLink
        to={tab.url}
        className={({ isActive }) =>
          `relative flex items-center justify-center h-14 px-4 text-md text-center capitalize ${
            isActive ? 'text-blue' : 'text-gray-900'
          }`
        }
        key={tab.label}
      >
        {tab.label}
        {tab.label === selectedTab ? (
          <motion.div
            className='absolute inset-x-0 bottom-[-1px] h-[2px] bg-blue'
            layoutId='navLinkUnderlineTabs'
            transition={{ duration: 0.3, ease: 'linear' }}
          ></motion.div>
        ) : null}
      </NavLink>
    )
  })
}
