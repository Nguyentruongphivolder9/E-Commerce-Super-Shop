import { ConversationSchema, MessageSchema } from 'src/utils/validations/chatValidation'
import { User } from './user.type'

export interface Conversation {
  id: string
  name: string
  accountIds: string[]
  messageIds: string[]
  createdAt: string
  updatedAt: string
  group: boolean
}

export type ConversationResponse = Conversation & {
  id: string
  name: string
  accountIds: string[]
  messageIds: string[]
  createdAt: string
  updatedAt: string
  group: boolean
}

export type ConversationRequest = ConversationSchema & {
  name: string
  isGroup: boolean
  messageIds?: string[]
  accountEmails: string[]
}

export interface Message {
  id: string
  body: string
  image?: string
  conversationId: string
  senderId: string
  createdAt: string
  updatedAt: string
}

export type MessageRequest = {
  body: string
  image?: string
  conversationId: string
}

export type MessageResponse = {
  id: string
  body: string
  image?: string
  conversationId: string
  senderId: string
  createdAt?: string
  updatedAt?: string
}

export type FullMessageType = MessageResponse & {
  sender: User
  // seen: User[]
}

export type FullConversationType = Conversation & {
  users: User[]
  messages: FullMessageType[]
}
