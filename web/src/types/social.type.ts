export type INavLink = {
  imgURL: string
  route: string
  label: string
}

export type IUpdateUser = {
  userId: string
  name: string
  bio: string
  imageId: string
  imageUrl: URL | string
  file: File[]
}

export type INewPost = {
  creatorId: string
  caption: string
  postImages: File[]
  location?: string
  tags?: string
}

export type IUpdatePost = {
  postId: string
  caption: string
  creatorId: string
  postImages: File[]
  location?: string
  tags?: string
}

export type Post = {
  id: string
  caption: string
  tags?: string
  location: string
  creatorId: string
  creatorName: string
  creatorAvatarUrl: string
  likes: AccountPostLikeResponse[]
  postImageResponses: PostImageResponse[]
  createdAt: string
  updatedAt: string
}

export type Creator = {
  id: string
  fullname: string
  avatarUrl: string
  bio: string
}

export type PostImageResponse = {
  id: string
  imageUrl: string
  postId: string
}

export type AccountPostLikeResponse = {
  id: string
  postId: string
  accountId: string
  accountName: string
  accountAvatarUrl: string
  createdAt: string
  updatedAt: string
}

export type SavePost = {
  id: string
  postId: string
  accountId: string
}
