import { HttpStatus, Injectable } from '@nestjs/common';
import { S3Client } from '@utils/s3.client';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@database/entities/category.entity';
import { Repository } from 'typeorm';
import { VideoEntity } from '@database/entities/video.entity';
import {
  AddReportVideoRequest,
  CountUsersVideoResponse,
  GetReportsRequest,
  GetReportsResponse,
  GetVideoIdRequest,
  GetWatchedVideoRequest,
  PinnedVideoRequest,
  PinnedVideoResponse,
  UpdateOrCreateReactionRequest,
  UpdateOrCreateReactionResponse,
  UpdateStatusReportRequest,
  UpdateVideoByIdRequest,
  UpdateViewRequest,
  UpdateViewResponse,
  UploadImageRequest,
  UploadImgRequest,
  UploadImgResponse,
  Video,
  VideoRequest,
  VideoSearchRequest,
} from 'clap-proto';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { CustomPaginate } from './helpers/custom-paginate';
import { DynamicSort } from './helpers/dynamic-sort';
import { VideoHistory } from '@database/entities/video-history.entity';
import { VideoReaction } from '@database/entities/video-reaction.entity';
import { VideoHistoryMapper } from './mapper/video-history-mapper';
import { VideoReactionMapper } from './mapper/video-reaction-mapper';
import { VideoViews } from '@database/entities/video-view.entity';
import { AppDataSource } from '@config/typeorm.config-datasource';
import { ReactionTypeEnum } from '@enums/reaction-type.enum';
import { VideoReport } from '@database/entities/video-report.entity';
import { VideoReportMapper } from './mapper/video-report-mapper';
import { CreateReportsQueryBuilder } from './helpers/get-reports-query-builder';
import { StatusEnum } from '@enums/status-enum';
import { VideoComments } from '@database/entities/video-comments.entity';

@Injectable()
export class VideoService {
  queryRunner;
  constructor(
    private readonly s3Service: S3Client,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    @InjectRepository(VideoHistory)
    private readonly videoHistory: Repository<VideoHistory>,
    @InjectRepository(VideoReaction)
    private readonly videoReaction: Repository<VideoReaction>,
    @InjectRepository(VideoViews)
    private readonly videoViews: Repository<VideoViews>,
    @InjectRepository(VideoReport)
    private readonly videoReport: Repository<VideoReport>,
  ) {
    this.queryRunner = AppDataSource.initialize();
  }
  async uploadVideo(
    uploadVideo: UploadImageRequest,
    userId: string,
  ): Promise<VideoEntity> {
    const { video, preview, ...videoInfo } = uploadVideo;
    try {
      const [videoUpload, previewUpload] = await Promise.all([
        this.s3Service.uploadVideo(uploadVideo),
        this.s3Service.uploadImg(uploadVideo.preview),
      ]);

      return this.saveVideo(
        {
          ...videoInfo,
          url: videoUpload.imageUrl,
          hashVideo: videoUpload.videoHash,
          previewUrl: previewUpload.imageUrl,
        },
        userId,
      );
    } catch (e) {
      throw new RpcException({
        code: status.RESOURCE_EXHAUSTED,
        message: 'Something wrong',
      });
    }
  }

  async saveVideo(videoBody: any, userId: string): Promise<VideoEntity> {
    const { category, ...createVideo } = videoBody;

    const video = await this.videoRepository.create();

    if (!video) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Video not found',
      });
    }

    const categories = await Promise.all(
      category.map(
        async (el) =>
          await this.categoryRepository.create({ name: el, videoId: video.id }),
      ),
    );

    video.previewUrl = videoBody.previewUrl;
    video.ownerId = userId;
    video.description = videoBody.description;
    video.url = videoBody.url;
    video.hashVideo = videoBody.hashVideo;
    video.duration = videoBody.duration;
    video.title = videoBody.title;
    video.categories = categories;

    await this.videoRepository.save(video);

    return video;
  }

  async getVideo(
    query: VideoRequest,
    userId: string,
  ): Promise<{ videos: VideoEntity[] }> {
    const qb = this.videoRepository
      .createQueryBuilder('video')
      .where('video.ownerId = :ownerId', { ownerId: userId })
      .leftJoinAndSelect('video.categories', 'categories')
      .loadRelationCountAndMap('video.countViews', 'video.views', 'countViews')
      .loadRelationCountAndMap('video.likes', 'video.reactions', 'reactions')
      .loadRelationCountAndMap('video.comments', 'video.comments', 'comments');

    if (query.search) {
      qb.andWhere(`video.title ilike :search`, {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    const videos = await qb.getMany();

    return {
      videos: CustomPaginate(
        DynamicSort(videos, query.field, query.sort),
        query,
      ),
    };
  }

  async getSearchVideos(
    query: VideoSearchRequest,
  ): Promise<{ videos: VideoEntity[] }> {
    const qb = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.categories', 'categories')
      .loadRelationCountAndMap('video.likes', 'video.reactions', 'reactions')
      .loadRelationCountAndMap('video.comments', 'video.comments', 'comments')
      .orderBy('video.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere(`video.title ilike :search`, {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    if (query.categories) {
      qb.andWhere(`categories.name IN(:...categories)`, {
        categories: [...query.categories],
      });
    }

    return { videos: await qb.getMany() };
  }

  async pinnedVideo(
    body: PinnedVideoRequest,
    metadata,
  ): Promise<PinnedVideoResponse> {
    const userId = String(metadata.getMap().user?.sub);

    const video = await this.videoRepository.findOne({
      where: { id: body.id },
    });
    if (!video) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Video not found',
      });
    }

    const checkPinned = await this.videoRepository.find({
      where: {
        ownerId: userId,
        isPinned: true,
      },
    });

    if (checkPinned.length === 3) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'You have already 3 pin',
      });
    }

    if (String(video.ownerId) !== userId) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: "You don't permission to update that pin",
      });
    }

    video.isPinned = body.isPinned;

    await this.videoRepository.save(video);

    return { status: HttpStatus.OK, error: null };
  }

  async getVideoById(
    videoId: GetVideoIdRequest,
  ): Promise<VideoEntity & { likes: number }> {
    const video = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.id = :videoId', { videoId: videoId.id })
      .leftJoinAndSelect('video.comments', 'comments')
      .leftJoinAndSelect('video.categories', 'categories')
      .loadRelationCountAndMap(
        'comments.likes',
        'comments.commentsLikes',
        'commentsLikes',
      )
      .loadRelationCountAndMap(
        'video.likes',
        'video.reactions',
        'countLikes',
        (qb) => qb.andWhere(`countLikes.type = 'like'`),
      )
      .loadRelationCountAndMap(
        'video.dislikes',
        'video.reactions',
        'countLikes',
        (qb) => qb.andWhere(`countLikes.type = 'dislike'`),
      )

      .getOne();

    if (!video) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Page not found',
      });
    }

    const likes = await this.videoReaction.count({
      where: { type: ReactionTypeEnum.LIKE, videoId: videoId.id },
    });

    return { ...video, likes };
  }

  async updateView(
    videoId: UpdateViewRequest,
    metadata,
  ): Promise<UpdateViewResponse> {
    const userId = metadata.getMap().user?.sub;
    const history = await this.videoHistory.create({
      userId,
      videoId: videoId.id,
    });

    const view = await this.videoViews.create({ videoId: videoId.id, userId });

    await Promise.all([
      this.videoHistory.save(history),
      this.videoViews.save(view),
      this.videoRepository.update(
        { id: videoId.id },
        { view: () => 'view + 1' },
      ),
    ]);

    return { status: HttpStatus.OK, error: null };
  }

  async updateOrCreateReaction(
    body: UpdateOrCreateReactionRequest,
    userId: string,
  ): Promise<UpdateOrCreateReactionResponse> {
    const reaction = { videoId: body.videoId, type: body.type, userId };
    const checkReaction = await this.videoReaction.findOne({
      where: { videoId: body.videoId, userId },
    });
    if (!checkReaction) {
      await this.createReaction(reaction);
    } else {
      await this.updateReaction(checkReaction, reaction);
    }
    return { status: HttpStatus.OK, error: null };
  }

  async createReaction(createReaction): Promise<void> {
    const reaction = this.videoReaction.create(createReaction);
    await this.videoReaction.save(reaction);
  }

  async updateReaction(checkReaction: VideoReaction, reaction): Promise<void> {
    if (String(checkReaction.type) === String(reaction.type)) {
      await this.videoReaction.delete({ id: checkReaction.id });
    } else {
      checkReaction.type = reaction.type;
      await this.videoReaction.save(checkReaction);
    }
  }

  async getAboutVideo(
    body: GetWatchedVideoRequest,
  ): Promise<{ videos: (Video | [])[] }> {
    let videos;
    if (body.type === 'watched') {
      videos = await this.getWatchedVideo(body.id);
    } else {
      videos = await this.getReactionVideo(body.id, body.type);
    }

    return { videos };
  }

  getWatchedVideo(userId: string): Promise<(Video | [])[]> {
    return this.videoHistory
      .find({
        where: { userId },
        relations: ['video'],
        order: {
          createdAt: 'DESC',
        },
      })
      .then((res) => res.map(VideoHistoryMapper.getVideoHistoryResponse));
  }

  getReactionVideo(
    userId: string,
    typeReaction: string,
  ): Promise<(Video | [])[]> {
    return this.videoReaction
      .find({
        where: { userId, type: typeReaction },
        relations: ['video'],
        order: {
          createdAt: 'DESC',
        },
      })
      .then((res) => res.map(VideoReactionMapper.getVideoReactionResponse));
  }

  async dashboardInfo(
    {},
    userId: string,
  ): Promise<{
    topComments?: VideoEntity;
    topLiked?: VideoEntity;
    topView?: VideoEntity;
  }> {
    const [topView, topLiked, topComments] = await Promise.all([
      this.mostTopViews(userId),
      this.mostTopLiked(userId),
      this.mostTopComments(userId),
    ]);

    const result = {};
    topView.view > 0 ? (result['topView'] = topView) : {};
    topLiked.likes > 0 ? (result['topLiked'] = topLiked) : {};
    topComments.comments > 0 ? (result['topComments'] = topComments) : {};

    return { ...result };
  }

  async mostTopComments(userId: string): Promise<any> {
    const qb = await this.videoRepository
      .createQueryBuilder('video')
      .loadRelationCountAndMap('video.comments', 'video.comments', 'comments')
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(vv.id)', 'count')
          .from(VideoComments, 'vv')
          .where('vv.videoId = video.id');
      })
      .loadRelationCountAndMap('video.likes', 'video.reactions', 'reactions')
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .orderBy('count', 'DESC')
      .take(1);

    return qb.getOne();
  }

  async mostTopViews(userId: string): Promise<VideoEntity> {
    const qb = await this.videoRepository
      .createQueryBuilder('video')
      .loadRelationCountAndMap('video.viewDate', 'video.views', 'views')
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .loadRelationCountAndMap('video.comments', 'video.comments', 'comments')
      .loadRelationCountAndMap('video.likes', 'video.reactions', 'reactions')
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(vv.id)', 'count')
          .from(VideoViews, 'vv')
          .where('vv.videoId = video.id');
      }, 'count')
      .orderBy('count', 'DESC')
      .take(1);

    return qb.getOne();
  }

  mostTopLiked(userId: string): Promise<any> {
    return this.videoRepository
      .createQueryBuilder('video')
      .loadRelationCountAndMap('video.likes', 'video.reactions', 'reactions')
      .loadRelationCountAndMap('video.comments', 'video.comments', 'comments')
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .where('video.ownerId = :ownerId', {
        ownerId: userId,
      })
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(vr.type)', 'count')
          .from(VideoReaction, 'vr')
          .where('vr.videoId = video.id')
          .andWhere('vr.type = :like', {
            like: 'like',
          });
      }, 'count')
      .orderBy('count', 'DESC')
      .take(1)
      .getOne();
  }

  async getStatisticInfo(
    dates: string[],
    userId: string,
  ): Promise<{
    viewsStatistic: VideoViews | VideoReaction;
    likesStatistic: VideoViews | VideoReaction;
    commentsStatistic: VideoViews | VideoReaction;
  }> {
    try {
      const queryRunner = await this.queryRunner;

      const [viewsStatistic, likesStatistic, commentsStatistic] =
        await Promise.all([
          this.getStatisticViews(queryRunner, dates, userId),
          this.getStatisticLikes(queryRunner, dates, userId),
          this.getStatisticComments(queryRunner, dates, userId),
        ]);

      return {
        viewsStatistic,
        likesStatistic,
        commentsStatistic,
      };
    } catch (e) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: e,
      });
    }
  }

  getStatisticViews(
    queryRunner,
    dates: string[],
    userId: string,
  ): Promise<VideoViews> {
    return queryRunner.manager
      .query(
        `select count(*) filter ( where "ownerId" = $1 and vv."videoId" = video_entity.id)::int as views,
             count(*) filter ( where "ownerId" = $1
        and vv."createdAt" between $2 and $3)::int as newviews
        from video_entity
        left join video_views vv on video_entity.id = vv."videoId";`,
        [userId, dates[0], dates[1]],
      )
      .then((res) => (res ? res[0] : {}));
  }

  getStatisticLikes(
    queryRunner,
    dates: string[],
    userId: string,
  ): Promise<VideoReaction> {
    return queryRunner.manager
      .query(
        `select count(*) filter ( where "ownerId" = $1 and "type" = 'like' and "ownerId" = vr."userId" and vr."videoId" = video_entity.id )::int as likes,
             count(*) filter ( where "userId" = $1 and "type" = 'like'
        and vr."createdAt" between $2 and $3 and "ownerId" = vr."userId")::int as newlikes
        from video_entity
        left join video_reaction vr on video_entity.id = vr."videoId";`,
        [userId, dates[0], dates[1]],
      )
      .then((res) => (res ? res[0] : {}));
  }

  getStatisticComments(
    queryRunner,
    dates: string[],
    userId: string,
  ): Promise<VideoViews> {
    return queryRunner.manager
      .query(
        `select count(*) filter ( where "ownerId" = $1 and vc."videoId" = video_entity.id)::int as comment,
             count(*) filter ( where "ownerId" = $1
        and vc."createdAt" between $2 and $3)::int as newcomment
        from video_entity
        left join video_comments vc on video_entity.id = vc."videoId"
        ;`,
        [userId, dates[0], dates[1]],
      )
      .then((res) => (res ? res[0] : {}));
  }

  async uploadImg(file: UploadImgRequest): Promise<UploadImgResponse> {
    return this.s3Service.uploadImg(file);
  }

  async addReport(
    body: AddReportVideoRequest,
    userId: string,
  ): Promise<VideoReport> {
    const createReport = await this.videoReport.create({ ...body, userId });

    await this.videoRepository.update(
      { id: body.videoId },
      { report: () => 'report + 1', status: StatusEnum.DEFAULT },
    );

    return this.videoReport.save(createReport);
  }

  async countUsersVideo(userIds): Promise<CountUsersVideoResponse> {
    const filterUsers =
      Object.keys(userIds).length === 0
        ? ''
        : `"where ownerId IN ('${userIds.userIds.join("','")}')"`;

    const queryRunner = await this.queryRunner;
    const countVideos = await queryRunner.manager.query(
      `select "ownerId", count(*)::int from video_entity
       ${filterUsers}
       group by  "ownerId";`,
    );

    return { countVideos };
  }

  async getUserContentById(
    userId: string,
  ): Promise<{ count: number; rows: VideoEntity[] }> {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.ownerId = :ownerId', { ownerId: userId })
      .leftJoinAndSelect('video.categories', 'categories')
      .loadRelationCountAndMap(
        'video.countComments',
        'video.comments',
        'countComments',
      )
      .loadRelationCountAndMap('video.countViews', 'video.views', 'countViews')
      .loadRelationCountAndMap(
        'video.countLikes',
        'video.reactions',
        'countLikes',
        (qb) => qb.andWhere(`countLikes.type = 'like'`),
      )
      .getMany();

    return { rows: videos, count: videos.length };
  }

  async getReports(query: GetReportsRequest): Promise<GetReportsResponse> {
    const result = await this.videoReport.find({
      where: CreateReportsQueryBuilder(query),
      relations: ['video'],
    });

    return VideoReportMapper.getVideoReportsResponse(result);
  }

  async getReviewedReports(): Promise<GetReportsResponse> {
    const result = await this.videoReport
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.video', 'video')
      .where('video.status = :status', { status: StatusEnum.REVIEWED })
      .distinctOn(['report.videoId'])
      .getMany();

    return VideoReportMapper.getReviewedReportsResponse(result);
  }

  async updateStatusReport(body: UpdateStatusReportRequest) {
    const { videoId } = await this.videoReport.findOne({
      where: { id: body.id },
    });

    if (!videoId) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: "Report don't found",
      });
    }

    await this.videoReport.update(
      { videoId: videoId },
      { status: body.status as StatusEnum },
    );

    await this.videoRepository.update(
      { id: videoId },
      { status: body.status as StatusEnum },
    );

    return { status: HttpStatus.OK, error: null };
  }

  async getVideoContent() {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.categories', 'categories')
      .loadRelationCountAndMap(
        'video.countComments',
        'video.comments',
        'countComments',
      )
      .loadRelationCountAndMap('video.countViews', 'video.views', 'countViews')
      .loadRelationCountAndMap(
        'video.countLikes',
        'video.reactions',
        'countLikes',
        (qb) => qb.andWhere(`countLikes.type = 'like'`),
      )
      .getMany();
    return { rows: videos, count: videos.length };
  }

  async updateVideoById(
    body: UpdateVideoByIdRequest,
    userId: string,
  ): Promise<UpdateViewResponse> {
    const video = await this.videoRepository.findOne({
      where: { id: body.id },
    });

    if (video.ownerId !== userId) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: `You don't have permission`,
      });
    }

    if (!video) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Video Not found',
      });
    }

    const categories = await Promise.all(
      body.category.split(',').map(
        async (el) =>
          await this.categoryRepository.create({
            name: el,
            videoId: video.id,
          }),
      ),
    );

    await this.categoryRepository.delete({
      videoId: body.id,
    });

    video.title = body.title;
    video.description = body.description;
    video.categories = categories;

    await this.videoRepository.save(video);

    return { status: HttpStatus.OK, error: null };
  }
}
