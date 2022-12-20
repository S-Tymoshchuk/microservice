/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import type { Empty } from "../../google/protobuf/empty";

export const protobufPackage = "auth";

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  birthDate: string;
}

export interface RegisterResponse {
  status: number;
  error: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string;
  token: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: number;
  error: string[];
  token: string;
}

export interface ChangePasswordRequest {
  token?: string | undefined;
  password: string;
  currentPassword?: string | undefined;
}

export interface ChangePasswordResponse {
  status: number;
  error: string[];
}

export interface GetUsersByIdRequest {
  users: string[];
  creator?: string | undefined;
  title?: string | undefined;
}

export interface GetUsersByIdResponse {
  users: UsersResponse[];
}

export interface UsersResponse {
  userId: string;
  username: string;
}

export interface GetUserProfileRequest {
  userId: string;
}

export interface GetUserProfileResponse {
  id: string;
  email: string;
  username: string;
  birthDate: string;
  bio: string;
  status: string;
  backgroundUrl: string;
  avatarUrl: string;
  roleId: string;
}

export interface UserSubscribeRequest {
  id: string;
}

export interface GetUserInfoResponse {
  id: string;
  email: string;
  birthDate: string;
  bio: string;
  status: string;
  backgroundUrl: string;
  avatarUrl: string;
  username: string;
  countSubscribe: number;
  description: string;
  isPrivate: boolean;
}

export interface UpdateUserInfoRequest {
  description?: string | undefined;
  username?: string | undefined;
}

export interface UpdatePrivateRequest {
  isPrivate: boolean;
}

export interface UpdateUserImgRequest {
  backgroundUrl?: string | undefined;
  avatarUrl?: string | undefined;
}

export interface UserSubscribeResponse {
  status: number;
  error: string[];
}

export interface UpdateUserInfoResponse {
  status: number;
  error: string[];
}

export interface UpdatePrivateResponse {
  status: number;
  error: string[];
}

export interface GetListUsersResponse {
  users: User[];
  count: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  status: string;
  createdAt: string;
}

export interface GetListUsersRequest {
  dates: string[];
  userName: string[];
  email: string[];
}

export interface GetUserInfoByIdRequest {
  id: string;
}

export interface ChangeStatusUserRequest {
  id: string;
  status: string;
}

export interface ChangeStatusUserResponse {
  status: number;
  error: string[];
}

export interface GetMySubscriptionsResponse {
  subscribers: Following[];
  userIds: string[];
}

export interface Following {
  id: string;
  email: string;
  username: string;
  bio: string;
  status: string;
  backgroundUrl: string;
  avatarUrl: string;
  description: string;
  countSubscribers: string;
}

export interface GetStatisticSubscriberRequest {
  dates: string[];
}

export interface GetStatisticSubscriberResponse {
  followerStatistic: SubscribeCount | undefined;
}

export interface SubscribeCount {
  follower: number;
  newfollower: number;
  unfollower: number;
}

export interface ViewCount {
  views: number;
  newviews: number;
}

export interface AuthService {
  register(request: RegisterRequest, metadata?: Metadata): Observable<LoginResponse>;
  login(request: LoginRequest, metadata?: Metadata): Observable<LoginResponse>;
  refresh(request: RefreshRequest, metadata?: Metadata): Observable<LoginResponse>;
  forgotPassword(request: ForgotPasswordRequest, metadata?: Metadata): Observable<ForgotPasswordResponse>;
  changePassword(request: ChangePasswordRequest, metadata?: Metadata): Observable<ChangePasswordResponse>;
  getUsersById(request: GetUsersByIdRequest, metadata?: Metadata): Observable<GetUsersByIdResponse>;
  userSubscribe(request: UserSubscribeRequest, metadata?: Metadata): Observable<UserSubscribeResponse>;
  userUnSubscribe(request: UserSubscribeRequest, metadata?: Metadata): Observable<UserSubscribeResponse>;
  getUserInfo(request: Empty, metadata?: Metadata): Observable<GetUserInfoResponse>;
  getUserProfile(request: GetUserProfileRequest, metadata?: Metadata): Observable<GetUserProfileResponse>;
  updateUserInfo(request: UpdateUserInfoRequest, metadata?: Metadata): Observable<UpdateUserInfoResponse>;
  updatePrivate(request: UpdatePrivateRequest, metadata?: Metadata): Observable<UpdatePrivateResponse>;
  updateUserImg(request: UpdateUserImgRequest, metadata?: Metadata): Observable<Empty>;
  getListUsers(request: GetListUsersRequest, metadata?: Metadata): Observable<GetListUsersResponse>;
  getUserInfoById(request: GetUserInfoByIdRequest, metadata?: Metadata): Observable<GetUserInfoResponse>;
  changeStatusUser(request: ChangeStatusUserRequest, metadata?: Metadata): Observable<ChangeStatusUserResponse>;
  getMySubscriptions(request: Empty, metadata?: Metadata): Observable<GetMySubscriptionsResponse>;
  getStatisticSubscribers(
    request: GetStatisticSubscriberRequest,
    metadata?: Metadata,
  ): Observable<GetStatisticSubscriberResponse>;
}
