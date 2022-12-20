import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpErrorIntercept } from './video/interceptors/httpError.interceptor';
import { VideoName, VideoPath } from 'clap-proto';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        maxSendMessageLength: 1024 * 1024 * 7 * 1024,
        maxReceiveMessageLength: 1024 * 1024 * 7 * 1024,
        url: '0.0.0.0:5002',
        package: VideoName,
        protoPath: VideoPath,
      },
    },
  );

  app.useGlobalInterceptors(new HttpErrorIntercept());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
}

bootstrap();
