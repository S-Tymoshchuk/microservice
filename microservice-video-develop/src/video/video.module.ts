import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { S3Client } from '@utils/s3.client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@database/entities/category.entity';
import { VideoEntity } from '@database/entities/video.entity';
import { VideoHistory } from '@database/entities/video-history.entity';
import { VideoReaction } from '@database/entities/video-reaction.entity';
import { VideoViews } from '@database/entities/video-view.entity';
import { VideoComments } from '@database/entities/video-comments.entity';
import { JwtConfig } from '@config/configuration';
import { VideoCommentService } from './video-comment.service';
import { VideoCommentsLikesEntity } from '@database/entities/video-comments-likes.entity';
import { TasksService } from '@utils/tasks.service';
import { VideoReport } from '@database/entities/video-report.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configurationService: ConfigService) => {
        const config = configurationService.get<JwtConfig>('jwt');
        return {
          publicKey: config.accessTokenPublicKey,
          signOptions: {
            algorithm: 'RS256',
          },
        };
      },
    }),
    TypeOrmModule.forFeature([
      Category,
      VideoEntity,
      VideoHistory,
      VideoReaction,
      VideoViews,
      VideoComments,
      VideoCommentsLikesEntity,
      VideoEntity,
      VideoReport,
    ]),
    //ScheduleModule.forRoot(),
  ],
  providers: [VideoService, S3Client, VideoCommentService, TasksService],
  controllers: [VideoController],
})
export class VideoModule {}
