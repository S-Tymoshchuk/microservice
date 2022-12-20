/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import type { Empty } from "../../google/protobuf/empty";

export const protobufPackage = "video";

export interface Category {
  name: string;
  id: string;
}

export interface SaveImageRequest {
  title: string;
  url: string;
  duration: number;
  category: string[];
  hashVideo: string;
}

export interface SaveImageResponse {
  id: string;
  title: string;
  duration: number;
  url: string;
  previewUrl: string;
  ownerId: string;
  hashVideo: string;
  categories: Category[];
  quality720: string;
  quality1080: string;
  description: string;
  createdAt: string;
}

export interface UploadImageRequest {
  video: VideoUpload | undefined;
  preview: VideoUpload | undefined;
  title: string;
  description: string;
  duration: string;
  category: string[];
}

export interface VideoUpload {
  binary: Uint8Array;
  mime: string;
  originalName: string;
}

export interface UploadImageResponse {
  imageUrl: string;
  videoHash: string;
}

export interface VideoRequest {
  pageSize: number;
  page: number;
  field: string;
  sort: string;
  search?: string | undefined;
}

export interface VideoSearchRequest {
  pageSize: number;
  page: number;
  field: string;
  sort: string;
  search?: string | undefined;
  categories: string[];
}

export interface VideoResponse {
  videos: Video[];
}

export interface GetWatchedVideoResponse {
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  duration: number;
  url: string;
  createdAt: string;
  isPinned: boolean;
  view: number;
  ownerId: string;
  type?: string | undefined;
  likes?: number | undefined;
  viewDate?: number | undefined;
  comments?: number | undefined;
}

export interface PinnedVideoRequest {
  id: string;
  isPinned: boolean;
}

export interface GetVideoIdRequest {
  id: string;
}

export interface UpdateViewRequest {
  id: string;
}

export interface UpdateOrCreateReactionRequest {
  type: string;
  videoId: string;
}

export interface GetWatchedVideoRequest {
  id: string;
  type: string;
}

export interface GetStudioInfoResponse {
  topView: Video | undefined;
  topLiked: Video | undefined;
  topComments: Video | undefined;
}

export interface GetStatisticInfoRequest {
  dates: string[];
}

export interface GetStatisticInfoResponse {
  viewsStatistic: ViewCount | undefined;
  likesStatistic: LikeCount | undefined;
  commentsStatistic: CommentCount | undefined;
}

export interface ViewCount {
  views: number;
  newviews: number;
}

export interface LikeCount {
  likes: number;
  newlikes: number;
}

export interface CommentCount {
  comment: number;
  newcomment: number;
}

export interface CreateCommentRequest {
  text: string;
  videoId: string;
}

export interface CreateCommentResponse {
  videoId: string;
  text: string;
  userId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoCommentsResponse {
  id: string;
  title: string;
  duration: number;
  url: string;
  createdAt: string;
  isPinned: boolean;
  view: number;
  ownerId: string;
  type?: string | undefined;
  likes?: number | undefined;
  viewDate?: string | undefined;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  likes: string;
}

export interface CreateLikeCommentRequest {
  id: string;
}

export interface RemoveCommentRequest {
  id: string;
}

export interface UploadImgRequest {
  binary: Uint8Array;
  mime: string;
  originalName: string;
  type?: string | undefined;
}

export interface UploadImgResponse {
  imageUrl: string;
}

export interface PinnedVideoResponse {
  status: number;
  error: string[];
}

export interface UpdateViewResponse {
  status: number;
  error: string[];
}

export interface UpdateOrCreateReactionResponse {
  status: number;
  error: string[];
}

export interface CreateLikeCommentResponse {
  status: number;
  error: string[];
}

export interface RemoveCommentResponse {
  status: number;
  error: string[];
}

export interface AddReportVideoRequest {
  reason: string;
  videoId: string;
  description?: string | undefined;
}

export interface AddReportVideoResponse {
  reason: string;
  videoId: string;
  userId: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CountUsersVideoResponse {
  countVideos: CountVideos[];
}

export interface CountVideos {
  ownerId: string;
  count: number;
}

export interface GetUserContentByIdRequest {
  id: string;
}

export interface GetUserContentByIdResponse {
  rows: UserContent[];
  count: number;
}

export interface UserContent {
  id: string;
  title: string;
  duration: number;
  url: string;
  createdAt: string;
  isPinned: boolean;
  view: number;
  ownerId: string;
  type?: string | undefined;
  countComments?: number | undefined;
  countViews?: number | undefined;
  countLikes?: number | undefined;
}

export interface GetReportsResponse {
  reports: Reports[];
  userIds: string[];
}

export interface Reports {
  id: string;
  createdAt: string;
  reason: string;
  description: string;
  userId: string;
  videoId: string;
  videoTitle: string;
  videoOwnerId: string;
  report: number;
  status: string;
  videoUpload: string;
}

export interface GetReportsRequest {
  dates: string[];
  reason?: string | undefined;
  title?: string | undefined;
  videoId?: string | undefined;
}

export interface UpdateStatusReportRequest {
  id: string;
  status: string;
}

export interface CountUsersVideoRequest {
  userIds: string[];
}

export interface VideoService {
  uploadVideo(request: UploadImageRequest, metadata?: Metadata): Observable<SaveImageResponse>;
  saveVideo(request: SaveImageRequest, metadata?: Metadata): Observable<SaveImageResponse>;
  getVideo(request: VideoRequest, metadata?: Metadata): Observable<VideoResponse>;
  getSearchVideo(request: VideoSearchRequest, metadata?: Metadata): Observable<VideoResponse>;
  pinnedVideo(request: PinnedVideoRequest, metadata?: Metadata): Observable<PinnedVideoResponse>;
  getVideoById(request: GetVideoIdRequest, metadata?: Metadata): Observable<VideoCommentsResponse>;
  updateView(request: UpdateViewRequest, metadata?: Metadata): Observable<UpdateViewResponse>;
  updateOrCreateReaction(
    request: UpdateOrCreateReactionRequest,
    metadata?: Metadata,
  ): Observable<UpdateOrCreateReactionResponse>;
  getWatchedVideo(request: GetWatchedVideoRequest, metadata?: Metadata): Observable<GetWatchedVideoResponse>;
  getStudioInfo(request: Empty, metadata?: Metadata): Observable<GetStudioInfoResponse>;
  getStatisticInfo(request: GetStatisticInfoRequest, metadata?: Metadata): Observable<GetStatisticInfoResponse>;
  createComment(request: CreateCommentRequest, metadata?: Metadata): Observable<CreateCommentResponse>;
  createLikeComment(request: CreateLikeCommentRequest, metadata?: Metadata): Observable<CreateLikeCommentResponse>;
  removeComment(request: RemoveCommentRequest, metadata?: Metadata): Observable<RemoveCommentResponse>;
  uploadImg(request: UploadImgRequest, metadata?: Metadata): Observable<UploadImgResponse>;
  addReportVideo(request: AddReportVideoRequest, metadata?: Metadata): Observable<AddReportVideoResponse>;
  countUsersVideo(request: CountUsersVideoRequest, metadata?: Metadata): Observable<CountUsersVideoResponse>;
  getUserContentById(request: GetUserContentByIdRequest, metadata?: Metadata): Observable<GetUserContentByIdResponse>;
  getReports(request: GetReportsRequest, metadata?: Metadata): Observable<GetReportsResponse>;
  getReviewedReports(request: Empty, metadata?: Metadata): Observable<GetReportsResponse>;
  updateStatusReport(request: UpdateStatusReportRequest, metadata?: Metadata): Observable<PinnedVideoResponse>;
  getVideoContent(request: Empty, metadata?: Metadata): Observable<GetUserContentByIdResponse>;
}
