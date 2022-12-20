import configuration from '../config/configuration';
import { ConfigModule } from '@nestjs/config';

export const initAppModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
  }),
];
