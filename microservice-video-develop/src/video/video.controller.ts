import { Controller, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Metadata, status } from '@grpc/grpc-js';
import { ValidateFormat } from '@utils/validate-mimetype-constant';
import { GrpcAuthGuard } from '../grpcAuthGuard.strategy';
import {
  AddReportVideoRequest,
  CountUsersVideoResponse,
  CreateCommentRequest,
  CreateLikeCommentResponse,
  GetReportsRequest,
  GetStatisticInfoRequest,
  GetVideoIdRequest,
  GetWatchedVideoRequest,
  PinnedVideoRequest,
  PinnedVideoResponse,
  RemoveCommentResponse,
  SaveImageRequest,
  UpdateOrCreateReactionRequest,
  UpdateOrCreateReactionResponse,
  UpdateStatusReportRequest,
  UpdateVideoByIdRequest,
  UpdateViewRequest,
  UpdateViewResponse,
  UploadImageRequest,
  UploadImgRequest,
  UploadImgResponse,
  VideoRequest,
  VideoSearchRequest,
} from 'clap-proto';
import { VideoEntity } from '@database/entities/video.entity';
import { VideoCommentService } from './video-comment.service';
import { VideoComments } from '@database/entities/video-comments.entity';
import { VideoReport } from '@database/entities/video-report.entity';

@Controller()
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoCommentService: VideoCommentService,
  ) {}

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UploadVideo')
  uploadVideo(videoUpload: UploadImageRequest, metadata): Promise<VideoEntity> {
    const userId = metadata.getMap().user?.sub;
    if (!ValidateFormat.includes(videoUpload.video?.mime)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'You must upload other format file!',
      });
    }
    return this.videoService.uploadVideo(videoUpload, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'SaveVideo')
  saveVideo(body: SaveImageRequest, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.videoService.saveVideo(body, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetVideo')
  getVideo(query: VideoRequest, metadata): Promise<{ videos: VideoEntity[] }> {
    const filterByUser = query.userId
      ? query.userId
      : metadata.getMap().user?.sub;

    return this.videoService.getVideo(query, filterByUser);
  }

  @GrpcMethod('VideoService', 'GetSearchVideos')
  getSearchVideos(
    query: VideoSearchRequest,
  ): Promise<{ videos: VideoEntity[] }> {
    return this.videoService.getSearchVideos(query);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'PinnedVideo')
  pinnedVideo(
    videoId: PinnedVideoRequest,
    metadata: Metadata,
  ): Promise<PinnedVideoResponse> {
    return this.videoService.pinnedVideo(videoId, metadata);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetVideoById')
  getVideoById(videoId: GetVideoIdRequest): Promise<VideoEntity> {
    return this.videoService.getVideoById(videoId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UpdateView')
  updateView(
    videoId: UpdateViewRequest,
    metadata,
  ): Promise<UpdateViewResponse> {
    return this.videoService.updateView(videoId, metadata);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UpdateOrCreateReaction')
  updateOrCreateReaction(
    body: UpdateOrCreateReactionRequest,
    metadata,
  ): Promise<UpdateOrCreateReactionResponse> {
    const userId = metadata.getMap().user?.sub;

    return this.videoService.updateOrCreateReaction(body, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetWatchedVideo')
  getWatchedVideo(body: GetWatchedVideoRequest) {
    return this.videoService.getAboutVideo(body);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetStudioInfo')
  getStudioInfo({}, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.videoService.dashboardInfo({}, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetStatisticInfo')
  getStatisticInfo(query: GetStatisticInfoRequest, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.videoService.getStatisticInfo(query.dates, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'CreateComment')
  async createComment(
    body: CreateCommentRequest,
    metadata,
  ): Promise<VideoComments> {
    const userId = metadata.getMap().user?.sub;
    return this.videoCommentService.createComment(body, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'CreateLikeComment')
  createLikeComment(param, metadata): Promise<CreateLikeCommentResponse> {
    const userId = metadata.getMap().user?.sub;
    return this.videoCommentService.createLikeComment(param.id, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'RemoveComment')
  removeComment(param, metadata): Promise<RemoveCommentResponse> {
    const userId = metadata.getMap().user?.sub;
    return this.videoCommentService.removeComment(param.id, userId);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UploadImg')
  uploadImg(file: UploadImgRequest): Promise<UploadImgResponse> {
    return this.videoService.uploadImg(file);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'AddReportVideo')
  addReportVideo(body: AddReportVideoRequest, metadata): Promise<VideoReport> {
    const userId = metadata.getMap().user?.sub;
    return this.videoService.addReport(body, userId);
  }

  @GrpcMethod('VideoService', 'CountUsersVideo')
  countUsersVideo(userIds): Promise<CountUsersVideoResponse> {
    return this.videoService.countUsersVideo(userIds);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetUserContentById')
  getUserContentById({ id }): Promise<{ count: number; rows: VideoEntity[] }> {
    return this.videoService.getUserContentById(id);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetReports')
  getReports(query: GetReportsRequest) {
    return this.videoService.getReports(query);
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetReviewedReports')
  getReviewedReports() {
    return this.videoService.getReviewedReports();
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UpdateStatusReport')
  updateStatusReport(body: UpdateStatusReportRequest) {
    return this.videoService.updateStatusReport(body);
  }
  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'GetVideoContent')
  getVideoContent() {
    return this.videoService.getVideoContent();
  }

  @UseGuards(GrpcAuthGuard)
  @GrpcMethod('VideoService', 'UpdateVideoById')
  updateVideoById(body: UpdateVideoByIdRequest, metadata) {
    const userId = metadata.getMap().user?.sub;
    return this.videoService.updateVideoById(body, userId);
  }

  @GrpcMethod('VideoService', 'GetSearchVideo')
  getSearchVideo(query: VideoSearchRequest) {
    return this.videoService.getSearchVideos(query);
  }
}
