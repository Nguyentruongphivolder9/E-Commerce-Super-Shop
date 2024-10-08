import EmptyState from './components/EmptyState'

import clsx from 'clsx'
import useConversationRoutes from './hooks/conversations/useConversationRoutes'

export default function Chat() {
  const { isOpen } = useConversationRoutes()

  return (
    <div className={clsx('lg:pl-80 h-full lg:block', isOpen ? 'block' : 'hidden')}>
      <EmptyState />
    </div>
  )
}
