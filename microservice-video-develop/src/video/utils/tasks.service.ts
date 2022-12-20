import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoEntity } from '@database/entities/video.entity';
import { Repository } from 'typeorm';
import { S3Client } from '@utils/s3.client';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
    private readonly s3Service: S3Client,
  ) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    const videoIsNotTransform = await this.videoRepository.find({
      where: { isTransform: false },
    });

    const getUrl = await Promise.all(
      videoIsNotTransform.map(
        async (el) => await this.s3Service.getObjects(el.hashVideo),
      ),
    );

    for (const el of getUrl) {
      const obj = {
        hashVideo: '',
        isTransform: false,
        quality1080:
          'https://clap-dev-elastictranscoderoutput.s3.amazonaws.com/',
        quality720:
          'https://clap-dev-elastictranscoderoutput.s3.amazonaws.com/',
      };

      if (el.Contents.length) {
        el.Contents.forEach((el2) => {
          switch (true) {
            case el2.Key.includes('720'):
              obj.quality720 = obj.quality720 + el2.Key;
              obj.hashVideo = el2.Key;
              obj.isTransform = true;
              break;

            case el2.Key.includes('1080'):
              obj.quality1080 = obj.quality1080 + el2.Key;
              obj.hashVideo = el2.Key;
              obj.isTransform = true;
              break;
            default:
          }
        });

        if (obj.isTransform) {
          await this.videoRepository.update(
            {
              hashVideo: obj.hashVideo.split('/')[0],
            },
            {
              ...obj,
            },
          );
        }
      }
    }
  }
}
