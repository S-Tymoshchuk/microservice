import { Module } from '@nestjs/common';
import { initAppModules } from './video/init/app-modules';
import { VideoModule } from './video/video.module';

@Module({
  imports: [...initAppModules, VideoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
