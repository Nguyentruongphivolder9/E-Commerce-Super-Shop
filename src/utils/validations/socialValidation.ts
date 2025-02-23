import * as yup from 'yup'

export const PostValidation = yup.object({
  caption: yup.string().min(5, 'Minimum 5 characters.').max(2200, 'Maximum 2,200 characters'),
  postImages: yup.array().of(yup.mixed<File>()),
  location: yup.string().min(1, 'This field is required').max(1000, 'Maximum 1000 characters.'),
  tags: yup.string()
})
