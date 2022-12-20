import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Initializer } from '@init/initializer';
import { GrpcErrorIntercept } from './interceptor/grpcError.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);

  const initializer = new Initializer(app, configService);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new GrpcErrorIntercept());
  initializer.run();

  const PORT = process.env.PORT || 5000;

  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
