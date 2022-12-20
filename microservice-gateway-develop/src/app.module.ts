import { Module } from '@nestjs/common';
import { AuthModule } from './models/auth/auth.module';
import { initAppModules } from '@init/app-modules';
import { VideoModule } from './models/video/video.module';
import { UserModule } from './models/user/user.module';
import { CommentsModule } from './models/comments/comments.module';
import { AdminModule } from './models/admin/admin.module';

@Module({
  imports: [...initAppModules, AuthModule, VideoModule, UserModule, CommentsModule, AdminModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
