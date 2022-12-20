import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AuthName,
  AuthService,
  GetStatisticInfoResponse,
  GetStudioInfoResponse,
  GetUserInfoResponse,
  GetWatchedVideoResponse,
  UploadImgResponse,
  UserSubscribeResponse,
  VideoName,
  VideoService,
} from 'clap-proto';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, Observable } from 'rxjs';
import { ParamDateQuery } from './dto/request/param-date-query';
import { ParamId } from '@decorators/param-id.decorator';
import { UpdateUserInfoRequest } from './dto/request/update-user-info-request';
import { UpdatePrivateRequest } from './dto/request/update-private-request';
import { GetSubscriberListMapper } from './mapper/get-subscriber-list.mapper';
import { CustomPaginate } from '@utils/helpers/custom-paginate';
import { DynamicSort } from '@utils/helpers/dynamic-sort';
import { PaginateQuery } from '../video/dto/request/paginate-query';
import { GetUserById } from './dto/request/get-user-by-id';

@Injectable()
export class UserService implements OnModuleInit {
  private svcVideo: VideoService;
  private svcAuth: AuthService;

  constructor(
    @Inject(VideoName)
    private readonly clientVideo: ClientGrpc,
    @Inject(AuthName)
    private readonly clientAuth: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svcVideo = this.clientVideo.getService<VideoService>('VideoService');
    this.svcAuth = this.clientAuth.getService<AuthService>('AuthService');
  }

  getWatchedVideo(param: { id: string; type: string }, metadata: Metadata): Observable<GetWatchedVideoResponse> {
    return this.svcVideo.getWatchedVideo(param, metadata);
  }

  getStudioInfo(metadata): Observable<GetStudioInfoResponse> {
    return this.svcVideo.getStudioInfo({}, metadata);
  }

  async getStatisticInfo(query: ParamDateQuery, metadata: Metadata): Promise<GetStatisticInfoResponse> {
    const videoStatistic = await firstValueFrom(this.svcVideo.getStatisticInfo(query, metadata));
    const subscribeStatistic = await firstValueFrom(this.svcAuth.getStatisticSubscribers(query, metadata));
    return { ...videoStatistic, ...subscribeStatistic };
  }

  userSubscribe(param: ParamId, metadata: Metadata): Observable<UserSubscribeResponse> {
    return this.svcAuth.userSubscribe(param, metadata);
  }

  async getUserInfo(query: GetUserById, metadata): Promise<GetUserInfoResponse> {
    const filterByUser = query.userId ? query.userId : metadata.getMap().user?.sub;
    const result = await firstValueFrom(this.svcAuth.getUserInfo({ id: filterByUser }, metadata));
    return { ...result, countSubscribeIds: !result.countSubscribeIds ? [] : result.countSubscribeIds };
  }

  async updateUserInfo(body: UpdateUserInfoRequest, metadata: Metadata) {
    return this.svcAuth.updateUserInfo(body, metadata);
  }

  updatePrivate(body: UpdatePrivateRequest, metadata: Metadata) {
    return this.svcAuth.updatePrivate(body, metadata);
  }

  async uploadImg(file, type: string, metadata: Metadata): Promise<UploadImgResponse> {
    const video = await firstValueFrom(this.svcVideo.uploadImg({ ...file, type }, metadata));
    await firstValueFrom(this.svcAuth.updateUserImg({ [type]: video.imageUrl }, metadata));
    return video;
  }

  async getMySubscriptions(query: PaginateQuery, metadata: Metadata) {
    const { subscribers, userIds } = await firstValueFrom(this.svcAuth.getMySubscriptions({}, metadata));
    let result;

    if (subscribers) {
      const { countVideos } = await firstValueFrom(this.svcVideo.countUsersVideo({ userIds: userIds }, metadata));
      result = subscribers.map((el) => GetSubscriberListMapper.getSubscriberListMapper(el, countVideos));
    } else {
      result = [];
    }

    return {
      count: result.length,
      rows: CustomPaginate(DynamicSort(result, query.field, query.sort), query),
    };
  }

  async deleteImg(type: string, metadata: Metadata) {
    await firstValueFrom(this.svcAuth.updateUserImg({ [type]: '' }, metadata));
  }

  userUnSubscribe(param: ParamId, metadata: Metadata) {
    return this.svcAuth.userUnSubscribe(param, metadata);
  }

  async getCreators(query: any, metadata: Metadata) {
    const { subscribers, userIds } = await firstValueFrom(this.svcAuth.getCreators({ search: query.search }, metadata));

    let result;
    if (subscribers) {
      const { countVideos } = await firstValueFrom(this.svcVideo.countUsersVideo({ userIds: userIds }, metadata));
      result = subscribers.map((el) => GetSubscriberListMapper.getSubscriberListMapper(el, countVideos));
    } else {
      result = [];
    }

    return {
      count: result.length,
      rows: CustomPaginate(DynamicSort(result, query.field, query.sort), query),
    };
  }
}
