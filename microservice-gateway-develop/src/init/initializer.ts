import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildDocs } from '@docs/helpers/docs.builder';

export class Initializer {
  public constructor(private readonly app: INestApplication, private readonly configService: ConfigService) {}

  public run(): void {
    this.initBaseConfig();
    this.initSwagger();
  }

  private initBaseConfig(): void {
    this.app.setGlobalPrefix('api');
  }

  private initSwagger(): void {
    if (this.configService.get('NODE_ENV') !== 'production') {
      buildDocs(this.app);
    }
  }
}
