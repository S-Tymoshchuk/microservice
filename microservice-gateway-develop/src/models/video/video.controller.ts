import {
  Controller,
  Inject,
  OnModuleInit,
  Post,
  UseInterceptors,
  Body,
  Get,
  Put,
  Param,
  Query,
  UploadedFiles,
  Patch,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiAcceptedResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Meta } from '@decorators/meta.decorator';
import { Metadata } from '@grpc/grpc-js';
import { SaveVideoRequest } from './dto/request/save-video-request';
import { VIDEO_TAG } from '@docs/tags';
import { ParamId } from '@decorators/param-id.decorator';
import { PinnedVideoRequest } from './dto/request/pinned-video-request';
import { PaginateQuery } from './dto/request/paginate-query';
import { firstValueFrom, Observable } from 'rxjs';
import { GetAllVideoResponse } from './dto/response/get-all-video-response';
import { UpdateOrCreateReactionRequest } from './dto/request/update-or-create-reaction-request';
import { SaveImageResponse, VideoName, VideoService } from 'clap-proto';
import { AuthContService } from '../auth/auth.service';
import { ReportVideoRequest } from './dto/request/report-video-request';
import { UploadVideoDecorator } from '@decorators/upload-video.decorator';
import { GetSaveVideoResponse } from './dto/response/get-save-video-response';
import { GetVideoQuery } from './dto/request/get-video-query';
import { CustomPaginate } from '@utils/helpers/custom-paginate';
import { DynamicSort } from '@utils/helpers/dynamic-sort';
import { UpdateVideRequest } from './dto/request/update-vide-request';
import { VideoServiceGateway } from './video.service-gateway';

@ApiTags(VIDEO_TAG)
@Controller('video')
export class VideoController implements OnModuleInit {
  constructor(private readonly authService: AuthContService, private readonly videoService: VideoServiceGateway) {}
  private svc: VideoService;

  @Inject(VideoName)
  private readonly clientVideo: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.clientVideo.getService<VideoService>('VideoService');
  }

  @ApiBearerAuth()
  @UploadVideoDecorator()
  @ApiCreatedResponse({ type: GetSaveVideoResponse })
  @Post('upload-video')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'preview', maxCount: 1 },
    ]),
  )
  private async uploadVideo(
    @Body() body: SaveVideoRequest,
    @UploadedFiles()
    { video, preview }: any,
    @Meta() meta: Metadata,
  ): Promise<Observable<SaveImageResponse>> {
    const sendVideo = {
      binary: video[0].buffer,
      mime: video[0].mimetype,
      originalName: video[0].originalname,
    };

    const sendPreview = {
      binary: preview[0].buffer,
      mime: preview[0].mimetype,
      originalName: preview[0].originalname,
    };

    return this.svc.uploadVideo({ video: sendVideo, preview: sendPreview, ...body, category: body.category.split(',') }, meta);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: GetAllVideoResponse })
  @Get()
  async getVideo(@Query() query: GetVideoQuery, @Meta() metadata: Metadata) {
    const result = await firstValueFrom(this.svc.getVideo(query, metadata));
    return {
      count: !result.videos ? 0 : result.videos.length,
      rows: !result.videos ? [] : result.videos,
    };
  }

  @ApiBearerAuth()
  @ApiAcceptedResponse()
  @Put('pinned/:id')
  pinnedVideo(@Meta() metadata: Metadata, @Param() { id }: ParamId, @Body() { isPinned }: PinnedVideoRequest) {
    return this.svc.pinnedVideo({ id, isPinned }, metadata);
  }

  @ApiBearerAuth()
  @ApiOkResponse()
  @Get(':id')
  async getVideoById(@Query() query: PaginateQuery, @Meta() metadata: Metadata, @Param() { id }: ParamId) {
    const video = await firstValueFrom(this.svc.getVideoById({ id }, metadata));
    const countUserSubscribe = await this.authService.countUserSubscribe(video.ownerId, metadata);

    // TODO: Need refactoring to service
    const ownerVideo = await firstValueFrom(this.authService.getUsersById([video.ownerId], metadata));
    let result = [];

    if (video.comments?.length) {
      const userIds = video.comments?.map((el) => el.userId);

      const { users } = await firstValueFrom(this.authService.getUsersById(userIds, metadata));

      result = video.comments.map((y) =>
        Object.assign(
          y,
          users.find((x) => x.userId === y.userId),
        ),
      );
    }

    return {
      ...video,
      ...countUserSubscribe,
      userName: ownerVideo.users[0].username,
      avatarUrl: ownerVideo.users[0].avatarUrl,
      userDescription: ownerVideo.users[0].userDescription,
      count: result.length,
      comments: CustomPaginate(DynamicSort(result, query.field, query.sort), query),
    };
  }

  @ApiBearerAuth()
  @Get('view/:id')
  updateView(@Param() { id }: ParamId, @Meta() metadata: Metadata) {
    return this.svc.updateView({ id }, metadata);
  }

  @ApiBearerAuth()
  @Post('reaction/:id')
  createReaction(@Param() { id }: ParamId, @Body() body: UpdateOrCreateReactionRequest, @Meta() metadata: Metadata) {
    return this.svc.updateOrCreateReaction({ videoId: id, type: body.type }, metadata);
  }

  @ApiBearerAuth()
  @Post(':id/report')
  createReportVideo(@Param() { id }: ParamId, @Body() body: ReportVideoRequest, @Meta() metadata: Metadata) {
    return this.svc.addReportVideo({ ...body, videoId: id }, metadata);
  }

  @ApiBearerAuth()
  @Patch(':id')
  updateVideoById(@Param() { id }: ParamId, @Body() body: UpdateVideRequest, @Meta() metadata: Metadata) {
    return this.svc.updateVideoById({ id, ...body }, metadata);
  }
}
