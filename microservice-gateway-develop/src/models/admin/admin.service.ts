import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  AuthName,
  AuthService,
  ChangeStatusUserResponse,
  GetListUsersResponse,
  GetUserContentByIdResponse,
  GetUserInfoResponse,
  Reports,
  VideoName,
  VideoService,
} from 'clap-proto';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { firstValueFrom, Observable } from 'rxjs';
import { GetUsersListMapper } from './mapper/get-users-list.mapper';
import { GetUsersFilterQuery } from './dto/get-users-filter-query';
import { CustomPaginate } from '@utils/helpers/custom-paginate';
import { DynamicSort } from '@utils/helpers/dynamic-sort';
import { ChangeStatusUsersRequest } from './dto/change-status-users-request';
import { GetReportsListMapper } from './mapper/get-reports-list.mapper';
import { ReportFilterQuery } from '../video/dto/request/report-filter-query';
import { PaginateQuery } from '../video/dto/request/paginate-query';
import { ChangeStatusReport } from './dto/change-status.report';
import { ParamId } from '@decorators/param-id.decorator';

@Injectable()
export class AdminService implements OnModuleInit {
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

  async getListUsers(query: GetUsersFilterQuery, metadata: Metadata): Promise<{ rows: GetListUsersResponse[]; count: number }> {
    const { users, count } = await firstValueFrom(this.svcAuth.getListUsers(query, metadata));

    const { countVideos } = await firstValueFrom(this.svcVideo.countUsersVideo({ userIds: [] }, metadata));

    return {
      rows: CustomPaginate(
        DynamicSort(
          users ? users.map((el) => GetUsersListMapper.getUsersListMapper(el, countVideos)) : [],
          query.field,
          query.sort,
        ),
        query,
      ),
      count,
    };
  }

  getUserInfoById(userId: string, metadata: Metadata): Observable<GetUserInfoResponse> {
    return this.svcAuth.getUserInfoById({ id: userId }, metadata);
  }

  getUserContentById(userId: string, metadata: Metadata): Observable<GetUserContentByIdResponse> {
    return this.svcVideo.getUserContentById({ id: userId }, metadata);
  }

  changeStatusUser(userId: string, body: ChangeStatusUsersRequest, metadata: Metadata): Observable<ChangeStatusUserResponse> {
    return this.svcAuth.changeStatusUser({ id: userId, status: body.status }, metadata);
  }

  async getReports(
    query: ReportFilterQuery,
    metadata: Metadata,
  ): Promise<{ count: number; rows: ((Reports & { createdBy: string; ownerName: string }) | [])[] }> {
    const { creator } = query;
    const { reports = [], userIds } = await firstValueFrom(this.svcVideo.getReports(query, metadata));

    const users = userIds
      ? await firstValueFrom(this.svcAuth.getUsersById({ users: userIds, creator }, metadata))
      : { users: [] };

    const result = !reports.length
      ? []
      : reports
          .map((el) => GetReportsListMapper.getReportsListMapper(el, users))
          .filter((el) => el?.createdBy !== null && el?.ownerName !== null);

    return {
      rows: CustomPaginate(DynamicSort(result, query.field, query.sort), query),
      count: result.length,
    };
  }

  async getReviewedReports(query: PaginateQuery, metadata: Metadata) {
    const { reports = [], userIds } = await firstValueFrom(this.svcVideo.getReviewedReports({}, metadata));

    const users = userIds ? await firstValueFrom(this.svcAuth.getUsersById({ users: userIds }, metadata)) : { users: [] };
    const result = !reports.length
      ? []
      : reports
          .map((el) => GetReportsListMapper.getReportsListMapper(el, users))
          .filter((el) => el?.createdBy !== null && el?.ownerName !== null);

    return {
      rows: CustomPaginate(DynamicSort(result, query.field, query.sort), query),
      count: result.length,
    };
  }

  updateStatusReport(param: ParamId, body: ChangeStatusReport, metadata: Metadata) {
    return this.svcVideo.updateStatusReport({ ...body, ...param }, metadata);
  }

  async getVideoContent(metadata: Metadata) {
    const videos = await firstValueFrom(this.svcVideo.getVideoContent({}, metadata));
    console.log(videos, '----');
  }
}
