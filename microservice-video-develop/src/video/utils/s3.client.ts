import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AwsConfig } from '@config/configuration';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import {
  UploadImageRequest,
  UploadImageResponse,
  UploadImgRequest,
  UploadImgResponse,
} from 'clap-proto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Client {
  private readonly logger = new Logger(S3Client.name);
  private readonly awsConfig: AwsConfig;
  private readonly client: S3;

  constructor(private configService: ConfigService) {
    this.awsConfig = configService.get('aws');
    this.client = new S3({
      credentials: {
        accessKeyId: this.awsConfig.accessKeyId,
        secretAccessKey: this.awsConfig.secretAccessKey,
      },
      region: this.awsConfig.defaultRegion,
    });
  }

  async uploadVideo(body: UploadImageRequest): Promise<UploadImageResponse> {
    const createName = body.video.originalName.split('.');
    const removeLastElement = createName.pop();

    const generateHash = uuidv4();
    createName.push(generateHash);
    createName.push(removeLastElement);

    try {
      const param: S3.Types.PutObjectRequest = {
        Bucket: this.awsConfig.bucketName,
        Key: body.video.originalName,
        Body: body.video.binary,
      };

      return this.client
        .upload(param)
        .promise()
        .then((res) => ({ imageUrl: res.Location, videoHash: generateHash }));
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  }

  async getObjects(el) {
    try {
      const param = {
        Bucket: 'clap-dev-elastictranscoderoutput',
        Delimiter: '/',
        Prefix: el.Key,
      };
      return this.client.listObjects(param).promise();
    } catch (e) {
      console.log(e);
    }
  }

  uploadImg(body: UploadImgRequest): Promise<UploadImgResponse> {
    try {
      const param: S3.Types.PutObjectRequest = {
        Bucket: this.awsConfig.bucketName,
        Key: body.originalName,
        Body: body.binary,
      };

      return this.client
        .upload(param)
        .promise()
        .then((res) => ({ imageUrl: res.Location }));
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  }
}
