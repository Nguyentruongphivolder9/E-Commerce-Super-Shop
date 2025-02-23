import { ConversationRequest, ConversationResponse, MessageRequest, MessageResponse } from 'src/types/chat.type'
import { User } from 'src/types/user.type'
import { Pagination, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const chatApi = {
  async getUsers() {
    return http.get<SuccessResponse<User[]>>('account/get-all')
  },
  getUserById(userId: string) {
    return http.get<SuccessResponse<User>>(`chat/account/${userId}`)
  },
  getUserByEmail(email: string) {
    return http.get<SuccessResponse<User>>(`chat/account/email/${email}`)
  },
  getOtherUser(conversationId: string) {
    return http.get<SuccessResponse<User>>(`chat/other_accounts/${conversationId}`)
  },

  async getConversations() {
    return http.get<SuccessResponse<Pagination<ConversationResponse[]>>>('chat/get_conversations')
  },
  async getConversationById(conversationId: string) {
    return http.get<SuccessResponse<ConversationResponse>>(`chat/get_conversation/${conversationId}`)
  },
  createConversation(body: ConversationRequest) {
    return http.post<SuccessResponse<ConversationResponse>>('chat/create_conversation', body)
  },
  createPrivateConversation(body: ConversationRequest) {
    return http.post<SuccessResponse<ConversationResponse>>('chat/create_conversation', body)
  },
  updateConversation(formData: { conversationId: string; body: ConversationRequest }) {
    return http.patch<SuccessResponse<ConversationResponse>>(
      `chat/update_conversation/${formData.conversationId}`,
      formData.body
    )
  },
  deleteConversation(conversationId: string) {
    return http.delete<SuccessResponse<null>>(`chat/delete_conversation/${conversationId}`)
  },

  async getMessages(conversationId: string) {
    return http.get<SuccessResponse<Pagination<MessageResponse[]>>>(`chat/get_messages/${conversationId}`)
  },
  sendMessage(body: MessageRequest) {
    return http.post<MessageResponse>(`chat/send_message`, body)
  },
  updateMessage(formData: { messageId: string; body: MessageRequest }) {
    return http.patch<SuccessResponse<MessageResponse>>(`chat/update_message/${formData.messageId}`, formData.body)
  },
  deleteMessage(messageId: string) {
    return http.delete<SuccessResponse<null>>(`chat/delete_message/${messageId}`)
  },
  getMessageById(messageId: string) {
    return http.get<SuccessResponse<MessageResponse>>(`chat/get_message/${messageId}`)
  },
  //test
  async getAllMessages() {
    return http.get<SuccessResponse<Pagination<MessageResponse[]>>>('chat/get_all')
  }
}

export default chatApi
