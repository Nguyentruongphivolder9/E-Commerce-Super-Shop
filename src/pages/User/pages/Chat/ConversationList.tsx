import { ScrollArea } from '@mantine/core'
import ItemConversation from './ItemConversation'

export default function ConversationList() {
  return (
    <ScrollArea className='h-full' scrollbarSize={8}>
      <ul className='h-full'>
        <li>
          <ItemConversation />
        </li>
      </ul>
    </ScrollArea>
  )
}
