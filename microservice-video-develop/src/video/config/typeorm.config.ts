import { config } from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.VIDEO_DATABASE_USERNAME,
  host: process.env.VIDEO_DATABASE_HOST,
  port: parseInt(process.env.VIDEO_DATABASE_PORT, 10),
  password: process.env.VIDEO_DATABASE_PASSWORD,
  database: process.env.VIDEO_DATABASE_NAME,
  //migrationsRun: process.env.VIDEO_DATABASE_MIGRATIONS_RUN === 'true',
  entities: [__dirname + '/../database/entities/*.entity.{ts,js}'],
  migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
  synchronize: true,
  logging: false,
};
