import { Controller, Inject, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ChangePasswordRequestDto,
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  RefreshRequestDto,
  GetUserProfileRequestDto,
} from './dto/request/auth.dto';
import { AuthService } from './service/auth.service';
import { Metadata } from '@grpc/grpc-js';
import {
  ChangePasswordResponse,
  ForgotPasswordResponse,
  GetStatisticSubscriberRequest,
  GetUserInfoByIdRequest,
  GetUsersByIdRequest,
  LoginResponse,
  RegisterResponse,
  UpdatePrivateRequest,
  UpdatePrivateResponse,
  UpdateUserImgRequest,
  UpdateUserInfoRequest,
  UpdateUserInfoResponse,
  UserSubscribeRequest,
  UserSubscribeResponse,
} from 'clap-proto';
import { GetUsersResponse } from './dto/response/get-users-response';
import { GetUserProfileResponseDto } from './dto/response/get-user-profile.response.dto';
import { GrpcAuthGuard } from './grpcAuthGuard.strategy';
import { GrpcAuthChangePassword } from '@decorators/grpc-auth-change-password';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;

  @GrpcMethod('AuthService', 'Register')
  private register(payload: RegisterRequestDto): Promise<RegisterResponse> {
    return this.service.register(payload);
  }

  @GrpcMethod('AuthService', 'Login')
  private login(payload: LoginRequestDto): Promise<LoginResponse> {
    return this.service.login(payload);
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  private forgotPassword(payload: ForgotPasswordRequestDto): Promise<ForgotPasswordResponse> {
    return this.service.forgotPassword(payload);
  }

  @UseGuards(GrpcAuthChangePassword)
  @GrpcMethod('AuthService', 'ChangePassword')
  private changePassword(payload: ChangePasswordRequestDto, metadata: Metadata): Promise<ChangePasswordResponse> {
    return this.service.changePassword(payload, metadata);
  }

  @GrpcMethod('AuthService', 'Refresh')
  private refresh(payload: RefreshRequestDto): Promise<LoginResponse> {
    return this.service.refresh(payload);
  }

  @GrpcMethod('AuthService', 'GetUsersById')
  getUsers(query: GetUsersByIdRequest): Promise<{ users: (GetUsersResponse | [])[] }> {
    return this.service.getUsersByIds(query);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('AuthService', 'UserSubscribe')
  userSubscribe(followingId: { id: string }, metadata): Promise<UserSubscribeResponse> {
    const followerId = metadata.getMap().user?.sub;
    return this.service.userSubscribe(followingId.id, followerId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('AuthService', 'GetUserInfo')
  getUserInfo(query: UserSubscribeRequest, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.service.getUserInfo(query.id ? query.id : userId);
  }

  @GrpcMethod('AuthService', 'GetUserProfile')
  @UseGuards(GrpcAuthGuard)
  getUserProfile({ userId }: GetUserProfileRequestDto): Promise<GetUserProfileResponseDto> {
    return this.service.getUserProfile(userId);
  }

  @GrpcMethod('AuthService', 'UpdateUserInfo')
  @UseGuards(GrpcAuthGuard)
  async updateUserInfo(body: UpdateUserInfoRequest, metadata): Promise<UpdateUserInfoResponse> {
    const userId = metadata.getMap().user?.sub;
    return this.service.updateUserInfo(body, userId);
  }

  @GrpcMethod('AuthService', 'UpdatePrivate')
  @UseGuards(GrpcAuthGuard)
  updatePrivate(body: UpdatePrivateRequest, metadata): Promise<UpdatePrivateResponse> {
    const userId = metadata.getMap().user?.sub;
    return this.service.updatePrivate(body, userId);
  }

  @GrpcMethod('AuthService', 'UpdateUserImg')
  @UseGuards(GrpcAuthGuard)
  updateUserImg(body: UpdateUserImgRequest, metadata): void {
    const userId = metadata.getMap().user?.sub;
    this.service.updateUserImg(body, userId);
  }

  @GrpcMethod('AuthService', 'GetMySubscriptions')
  @UseGuards(GrpcAuthGuard)
  getMySubscriptions({}, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.service.getMySubscriptions(userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('AuthService', 'UserUnSubscribe')
  userUnSubscribe(followingId: { id: string }, metadata): Promise<UserSubscribeResponse> {
    const followerId = metadata.getMap().user?.sub;
    return this.service.userUnSubscribe(followingId.id, followerId);
  }
  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('AuthService', 'GetStatisticSubscribers')
  getStatisticSubscribers(query: GetStatisticSubscriberRequest, metadata): Promise<{ followerStatistic: any }> {
    const userId = metadata.getMap().user?.sub;

    return this.service.getStatisticSubscribers(query.dates, userId);
  }

  //@UseGuards(GrpcAuthChangePassword)
  @GrpcMethod('AuthService', 'GetCreators')
  getCreators(query, metadata): any {
    const userId = metadata.getMap().user?.sub;

    return this.service.getCreators(query, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('AuthService', 'GetCountSubscribeById')
  getCountSubscribeById({ id }: GetUserInfoByIdRequest) {
    return this.service.getCountSubscribeById(id);
  }
}
