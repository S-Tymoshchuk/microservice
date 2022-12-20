import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthName, AuthPath } from 'clap-proto';
import { AuthContService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Service } from '@config/configuration';

@Global()
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
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthContService],
  exports: [AuthContService],
})
export class AuthModule {}
