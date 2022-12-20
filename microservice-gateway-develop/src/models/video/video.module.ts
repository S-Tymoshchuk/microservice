import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { VideoController } from './video.controller';
import { AuthName, AuthPath, VideoName, VideoPath } from 'clap-proto';
import { ConfigService } from '@nestjs/config';
import { Service } from '@config/configuration';
import { AuthModule } from '../auth/auth.module';
import { VideoServiceGateway } from './video.service-gateway';
import { SearchController } from './search.controller';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
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
      {
        inject: [ConfigService],
        name: AuthName,
        useFactory: async (configService: ConfigService) => {
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
    ]),
  ],
  providers: [VideoServiceGateway],
  controllers: [VideoController, SearchController],
})
export class VideoModule {}
