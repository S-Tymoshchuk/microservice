import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';
import { DatabaseModule } from '@database/database.module';

export const initAppModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
  DatabaseModule,
];
