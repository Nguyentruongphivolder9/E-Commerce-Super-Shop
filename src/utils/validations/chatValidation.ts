import * as yup from 'yup'

export const messageSchema = yup.object({
  body: yup.string().nullable(),
  image: yup.string().url('Image must be a valid URL').nullable(),
  conversationId: yup
    .string()
    .required('Conversation ID is required')
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      'Conversation ID must be a valid UUID'
    ),
  senderId: yup
    .string()
    .required('Sender ID is required')
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      'Sender ID must be a valid UUID'
    )
})

export const conversationSchema = yup.object({
  name: yup.string().required('Name is required'),
  isGroup: yup.boolean().required('isGroup is required'),
  messageIds: yup
    .array()
    .of(
      yup
        .string()
        .matches(
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          'Message ID must be a valid UUID'
        )
    )
    .required('Message IDs are required'),
  accountEmails: yup
    .array()
    .of(yup.string().email('Each account email must be a valid email'))
    .required('Account emails are required')
})

export type ConversationSchema = yup.InferType<typeof conversationSchema>
export type MessageSchema = yup.InferType<typeof messageSchema>
