import { ConversationSchema } from './../utils/validations/chatValidation'
import { createContext } from 'vm'
import { User } from 'src/types/user.type'
import { getProfileFromLs } from 'src/utils/auth'
import { useState } from 'react'
import ContainerModal from 'src/components/ContainerModal'

interface ConversationContextInterface {
  profile: User | null
  reset: () => void
  setIsModal: React.Dispatch<React.SetStateAction<boolean | false>>
  setChildrenModal: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
}

export type FormDataConversation = Pick<ConversationSchema, 'name' | 'isGroup' | 'messageIds' | 'accountEmails'>

const initialConversationAddContext: ConversationContextInterface = {
  profile: getProfileFromLs() as User,
  reset: () => null,
  setChildrenModal: () => null,
  setIsModal: () => null
}

export const ConversationContext = createContext(initialConversationAddContext)

export const ConversationAddProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<User | null>(initialConversationAddContext.profile)
  const [isModal, setIsModal] = useState<boolean>(false)
  const [childrenModal, setChildrenModal] = useState<React.ReactNode>(null)

  const reset = () => {
    setProfile(null)
  }

  return (
    <ConversationContext.Provider
      value={{
        profile,
        reset,
        setIsModal,
        setChildrenModal
      }}
    >
      {isModal && <ContainerModal>{childrenModal}</ContainerModal>}
      {children}
    </ConversationContext.Provider>
  )
}
