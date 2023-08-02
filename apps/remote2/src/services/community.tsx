import { getPostParam_Type } from "@/types/request.type";
import axios from "axios";
const API_ENDPOINT = 'https://dev.api.lounge.tdi9.com/api/v1' // import.meta.env.VITE_API_ENDPOINT;


export function get_all_categories() {
  return axios.get(`${API_ENDPOINT}/postCategories`);
}

export function getAllPost(params: getPostParam_Type) {
  return axios.get(`${API_ENDPOINT}/board/${1}/posts`, { params });
}

export function likeAPI(postID: number, commentID?: number) {
  if (commentID)
    axios.post(
      `${API_ENDPOINT}/board/1/post/${postID}/comments/${commentID}/like`
    );
  else axios.post(`${API_ENDPOINT}/board/1/posts/${postID}/like`);
}

export function dislikeAPI(postID: number, commentID?: number) {
  if (commentID)
    axios.post(
      `${API_ENDPOINT}/board/1/post/${postID}/comments/${commentID}/dislike`
    );
  else axios.post(`${API_ENDPOINT}/board/1/posts/${postID}/dislike`);
}

//post detail

export function getPostByID(id: string | undefined) {
  return axios.get(`${API_ENDPOINT}/board/1/posts/${id}`);
}

export function getCommentsByPostID(postID: number) {
  return axios.get(`${API_ENDPOINT}/board/1/post/${postID}/comments`);
}

export function commentOnPost(postID: number, payload: any) {
  return axios.post(`${API_ENDPOINT}/board/1/post/${postID}/comments`, payload);
}

export function commentIconOnPost(postID: number, payload: any) {
  return axios.post(
    `${API_ENDPOINT}/board/1/post/${postID}/comments-emoticon`,
    payload
  );
}

export function getAllEmoticonPackages() {
  return axios.get(`${API_ENDPOINT}/emoticonPackages`);
}

export function get_All_Emoicon_By_PackageID(packageID: any) {
  return axios.get(`${API_ENDPOINT}/emoticonPackages/${packageID}`);
}

export function pickOrUnpickPost(postID: number) {
  return axios.post(`${API_ENDPOINT}/board/1/posts/${postID}/pick`);
}

export function blockUser(blockedUserID: number) {
  const body = {
    blockedUserId: blockedUserID,
  };
  return axios.post(`${API_ENDPOINT}/blacklists`, body);
}

export function deleteComment(postID: number, commentID: number) {
  return axios.delete(
    `${API_ENDPOINT}/board/1/post/${postID}/comments/${commentID}`
  );
}

export function deletePostAPI(postID: number) {
  return axios.delete(`${API_ENDPOINT}/board/1/posts/${postID}`);
}

//profile page
export function get_myposts(page: number) {
  return axios.get(`${API_ENDPOINT}/board/1/my-posts?page=${page}`);
}

export function get_pickposts(page: number) {
  return axios.get(`${API_ENDPOINT}/board/1/pick-posts?page=${page}`);
}

export function getMyInfo() {
  return axios.get(`${API_ENDPOINT}/me`);
}

export function patchName(name: any) {
  const body = { name: name };
  return axios.patch(`${API_ENDPOINT}/profile`, body);
}

export function uploadAvatar(fromData: any) {
  return axios.post(`${API_ENDPOINT}/profile/image`, fromData);
}

export function deleteAvatar() {
  return axios.delete(`${API_ENDPOINT}/profile/image`);
}

//write post
export function writeNewPost(formData: any) {
  return axios.post(`${API_ENDPOINT}/board/1/posts`, formData);
}

export function EditPost(formData: any, id: any) {
  return axios.post(`${API_ENDPOINT}/board/1/posts/${id}`, formData);
}

//black list
export function getBlackList() {
  return axios.get(`${API_ENDPOINT}/blacklists`);
}

export function removeOfBlockedList(blacklisID: number) {
  return axios.delete(`${API_ENDPOINT}/blacklists/${blacklisID}`);
}

//edit comment
export function getCommentByID(postID: any, commentID: any) {
  return axios.get(
    `${API_ENDPOINT}/board/1/post/${postID}/comments/${commentID}`
  );
}

export function editComment(postID: any, commentID: any, text: string) {
  const body = {
    content: text,
  };
  return axios.put(
    `${API_ENDPOINT}/board/1/post/${postID}/comments/${commentID}`,
    body
  );
}

//report

export function reportPostAndComment(params: any) {
  return axios.post(`${API_ENDPOINT}/reports`, params);
}
