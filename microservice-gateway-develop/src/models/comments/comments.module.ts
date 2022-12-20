import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthName, AuthPath, VideoName, VideoPath } from 'clap-proto';
import { ConfigService } from '@nestjs/config';
import { Service } from '@config/configuration';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: AuthName,
        useFactory: (configService: ConfigService) => {
          const { auth } = configService.get<Service>('service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${auth.host}:${auth.port}`,
              package: AuthName,
              protoPath: AuthPath,
            },
          };
        },
      },
      {
        inject: [ConfigService],
        name: VideoName,
        useFactory: async (configService: ConfigService) => {
          const { video } = configService.get<Service>('service');
          return {
            transport: Transport.GRPC,
            options: {
              url: `${video.host}:${video.port}`,
              package: VideoName,
              protoPath: VideoPath,
            },
          };
        },
      },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
