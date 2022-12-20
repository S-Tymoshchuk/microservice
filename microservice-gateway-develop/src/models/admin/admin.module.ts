import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthName, AuthPath, VideoName, VideoPath } from 'clap-proto';
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
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
