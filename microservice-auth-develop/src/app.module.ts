import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { initAppModules } from './auth/init/app-modules';

@Module({
  imports: [...initAppModules, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
