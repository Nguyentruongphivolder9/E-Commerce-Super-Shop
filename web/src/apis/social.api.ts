import { INewPost, IUpdatePost, Post, SavePost } from 'src/types/social.type'
import { Pagination, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const socialApi = {
  //done
  async getPostById(postId?: string) {
    return http.get<SuccessResponse<Post>>(`social/get_post/${postId}`)
  },
  //done
  async searchPosts(searchTerm: string) {
    return http.get<SuccessResponse<Pagination<Post[]>>>(`social/search_posts?term=${searchTerm}`)
  },
  //done
  async getInfinitePosts({ pageParam }: { pageParam: number }) {
    return http.get<SuccessResponse<Pagination<Post[]>>>(`social/get_infinite_posts?pages=${pageParam}`)
  },
  //done
  async createPost(post: INewPost) {
    return http.post<SuccessResponse<Post>>(`social/create_post`, post, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  async updatePost(post: IUpdatePost) {
    return http.post<SuccessResponse<Post>>(`social/update_post/${post.postId}`, post, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  //done
  async deletePost(postId: string) {
    return http.delete<SuccessResponse<Post>>(`social/delete_post/${postId}`)
  },
  //done
  async likePost(postId: string) {
    return http.post<SuccessResponse<boolean>>(`social/toggle_like/${postId}`)
  },
  //done
  async getLikedPosts(userId: string) {
    return http.get<SuccessResponse<Post[]>>(`social/get_liked_posts/${userId}`)
  },
  //done
  async savePost(postId: string) {
    return http.post<SuccessResponse<SavePost>>(`social/save_post/${postId}`)
  },
  //done
  async getUserSavedIdPosts() {
    return http.get<SuccessResponse<SavePost[]>>('social/get_saved_id_posts')
  },
  //done
  async getUserSavedPosts() {
    return http.get<SuccessResponse<Post[]>>('social/get_saved_posts')
  },
  //done
  async deleteSavedPost(savedPostId: string) {
    return http.delete<SuccessResponse<boolean>>(`social/delete_save_post/${savedPostId}`)
  },
  //done
  async getCurrentUserPosts() {
    return http.get<SuccessResponse<Post[]>>(`social/get_posts_of_user`)
  },
  //done
  async getRecentPosts() {
    return http.get<SuccessResponse<Pagination<Post[]>>>(`social/get_recent_posts`)
  },
  //done
  async getUserPosts(userId: string) {
    return http.get<SuccessResponse<Post[]>>(`social/get_posts_of_user_by_id/${userId}`)
  }
}

export default socialApi
