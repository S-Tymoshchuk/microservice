import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthName, AuthPath, VideoName, VideoPath } from 'clap-proto';
import { ConfigService } from '@nestjs/config';
import { Service } from '@config/configuration';

@Module({
  imports: [
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
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
