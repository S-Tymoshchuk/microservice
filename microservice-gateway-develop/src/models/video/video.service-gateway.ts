import { Inject, Injectable } from '@nestjs/common';
import { AuthName, AuthService, VideoName, VideoService } from 'clap-proto';
import { ClientGrpc } from '@nestjs/microservices';
import { PaginateSearchQuery } from './dto/request/paginate-search-query';
import { firstValueFrom } from 'rxjs';
import { GetSubscriberListMapper } from '../user/mapper/get-subscriber-list.mapper';
import { CustomPaginate } from '@utils/helpers/custom-paginate';
import { DynamicSort } from '@utils/helpers/dynamic-sort';

@Injectable()
export class VideoServiceGateway {
  private svcVideo: VideoService;
  private svcAuth: AuthService;

  @Inject(VideoName)
  private readonly clientVideo: ClientGrpc;

  @Inject(AuthName)
  private readonly clientAuth: ClientGrpc;

  public onModuleInit(): void {
    this.svcVideo = this.clientVideo.getService<VideoService>('VideoService');
    this.svcAuth = this.clientAuth.getService<AuthService>('AuthService');
  }

  async getSearchVideo(query: PaginateSearchQuery) {
    let videos = { rows: [], count: 0 };
    let creators = { rows: [], count: 0 };

    const findVideo = await firstValueFrom(this.svcVideo.getSearchVideo(query));

    if (query.search) {
      creators = await this.getCreators(query);
    }

    if (findVideo.videos) {
      const userIds = findVideo.videos.map((el) => el.ownerId);

      const { users } = await firstValueFrom(this.svcAuth.getUsersById({ users: userIds }));

      const result = findVideo.videos.map((y) =>
        Object.assign(
          y,
          users.find((x) => x.userId === y.ownerId),
        ),
      );

      videos = {
        count: result.length,
        rows: CustomPaginate(DynamicSort(result, query.field || 'createdAt', query.sort || 'desc'), query),
      };
    }

    return { videos, creators };
  }

  async getCreators(query) {
    const { subscribers, userIds } = await firstValueFrom(this.svcAuth.getCreators({ search: query.search }));

    let result;

    if (subscribers) {
      const { countVideos } = await firstValueFrom(this.svcVideo.countUsersVideo({ userIds: userIds }));
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
